<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
          <el-form-item label="输入搜索" prop="name">
            <el-input v-model="formInline.name" placeholder="角色名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="loading">查询</el-button>
            <el-button @click="resetForm" :disabled="loading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button @click="handleAdd()" size="small">添加角色</el-button>
      </div>
      <el-divider></el-divider>
      <el-table :data="roles" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="name" label="角色名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="createdTime" label="添加时间">
          <template slot-scope="scope">{{scope.row.createdTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleMenu(scope.row)" type="text" size="small">分配菜单</el-button>
            <el-button @click="handleResource(scope.row)" type="text" size="small">分配资源</el-button>
            <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增和编辑 -->
      <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
        close-on-click-modal
      >
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="角色编码" prop="code">
            <el-input v-model="form.code"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="form.description"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { roles, delRole, editRole } from "@/services/role";

export default Vue.extend({
  name: "RoleList",
  data() {
    return {
      roles: [],
      formInline: {
        name: "",
        current: 1,
        size: 500
      },
      total: 0,
      categoryData: [],
      loading: false,
      dialogVisible: false,
      form: { id: 0, name: "", code: "", description: "" },
      title: "添加角色"
    };
  },
  created() {
    this.loadRole();
  },
  methods: {
    onSubmit() {
      this.loadRole();
    },
    resetForm() {
      (this.$refs.formInline as any).resetFields();
      this.onSubmit();
    },
    async loadRole() {
      const { data } = await roles(this.formInline);
      if (data.code !== "000000") return;
      this.roles = data.data.records;
    },

    handleEdit(item: any) {
      this.title = "编辑角色";
      this.form = {
        id: item.id,
        name: item.name,
        code: item.code,
        description: item.description
      };
      this.dialogVisible = true;
    },
    handleDelete(item: any) {
      this.$confirm("确认删除该角色吗？", "删除提示", {})
        .then(async () => {
          // 确认删除
          const { data } = await delRole(item.id);
          if (data.code === "000000") {
            // 删除成功需要刷新列表
            this.$message.success("删除成功");
            this.loadRole();
          }
        })
        .catch(err => {
          this.$message.warning("取消删除");
        });
    },
    // 添加角色
    handleAdd() {
      this.dialogVisible = true;
      console.log(this.form);
    },
    handleClose() {
      this.form = {
        id: 0,
        name: "",
        code: "",
        description: ""
      };
      // (this.$refs.form as any).resetFields();
      this.dialogVisible = false;
    },
    async updateRole() {
      const formData = { ...this.form };
      if (formData.id === 0) {
        delete formData.id;
      }
      await editRole(formData);
      this.dialogVisible = false;
      // 新增成功刷新表格
      this.loadRole();
    },
    // 分配菜单
    handleMenu(item: any) {
      this.$router.push({
        name: "menu-list"
      });
    },
    // 分配资源
    handleResource(item: any) {
      this.$router.push({
        name: "menu-list"
      });
    }
  }
});
</script>
