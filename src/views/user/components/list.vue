<template>
  <div class="user-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formInline.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" prop="time">
            <el-date-picker
              v-model="formInline.time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="loading">查询</el-button>
            <el-button @click="resetForm" :disabled="loading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button @click="handleAdd()" size="small">添加</el-button>
        <el-button @click.native="categoryPage" size="small">资源分类</el-button>
      </div>
      <el-divider></el-divider>
      <el-table :data="users" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="createTime" label="注册时间">
          <template slot-scope="scope">{{scope.row.createdTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleRole(scope.row)" type="text" size="small">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 翻页 -->
      <el-pagination
        :disabled="loading"
        style="margin-top: 20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="formInline.current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="formInline.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogVisible" width="30%" close-on-click-modal>
      <el-select style="width: 100%" v-model="roleIdList" multiple placeholder="请选择">
        <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAllocRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Moment from "moment";
import { getUserPages } from "@/services/user";
import { getRoleAll, allocateUserRoles, getRoleUser } from "@/services/role";

export default Vue.extend({
  name: "userList",
  data() {
    return {
      users: [],
      formInline: {
        phone: "",
        time: [],
        current: 1,
        size: 10
      },
      total: 0,
      loading: false,
      dialogVisible: false,
      roleIdList: [],
      roleList: [],
      userId: ""
    };
  },
  created() {
    this.loadUsers();
  },
  methods: {
    onSubmit() {
      this.formInline.current = 1;
      this.loadUsers();
    },
    resetForm() {
      (this.$refs.formInline as any).resetFields();
      this.onSubmit();
    },
    async loadUsers() {
      this.loading = true;
      const queryData = {
        current: this.formInline.current,
        size: this.formInline.size,
        phone: this.formInline.phone,
        startCreateTime: this.formInline.time[0]
          ? Moment(this.formInline.time[0]).format("YYYY-MM-DD HH:mm:ss")
          : "",
        endCreateTime: this.formInline.time[1]
          ? Moment(this.formInline.time[1]).format("YYYY-MM-DD HH:mm:ss")
          : ""
      };

      const { data } = await getUserPages(queryData);
      this.loading = false;
      this.users = data.data.records;
      this.total = data.data.total;
    },

    handleSizeChange(val: number) {
      this.formInline.size = val;
      this.formInline.current = 1;
      this.loadUsers();
    },
    handleCurrentChange(val: number) {
      this.formInline.current = val;
      this.loadUsers();
    },
    // 分配角色
    handleRole(item: any) {
      this.userId = item.id;
      // 加载所有角色
      this.loadRollAll();
      // 加载用户的角色
      this.loadRollUser();
      this.roleIdList = [];
      this.dialogVisible = true;
    },
    async loadRollUser() {
      const { data } = await getRoleUser(this.userId);
      this.roleIdList = data.data.map((item: any) => {
        return item.id;
      });
    },
    async loadRollAll() {
      const { data } = await getRoleAll();
      this.roleList = data.data;
    },
    async handleAllocRole() {
      await allocateUserRoles({
        userId: this.userId,
        roleIdList: this.roleIdList
      });
      this.$message.success("分配角色成功啦");
      this.dialogVisible = false;
    }
  }
});
</script>
