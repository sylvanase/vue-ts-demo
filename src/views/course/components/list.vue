<template>
  <div class="course-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="formInline.courseName" placeholder="请输入课程名称"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="formInline.status" placeholder="请选择">
              <el-option value>全部</el-option>
              <el-option value="1">上架</el-option>
              <el-option value="0">下架</el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="loading">查询</el-button>
            <el-button @click="resetForm" :disabled="loading">重置</el-button>
            <el-button
              @click.native="$router.push({
              name:'course-create'
            })"
              size="small"
            >添加课程</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="courses" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="courseName" label="课程名称"></el-table-column>
        <el-table-column prop="sortNum" label="排序"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="1"
              inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="scope.row.isStatusLoading"
              @change="handleStatus(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleRole(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleRole(scope.row)" type="text" size="small">内容管理</el-button>
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
    <!-- <el-dialog title="分配角色" :visible.sync="dialogVisible" width="30%" close-on-click-modal>
      <el-select style="width: 100%" v-model="roleIdList" multiple placeholder="请选择">
        <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAllocRole">确 定</el-button>
      </span>
    </el-dialog>-->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getQueryCourses, changeState } from "@/services/course";

export default Vue.extend({
  name: "courseList",
  data() {
    return {
      courses: [],
      formInline: {
        status: "",
        courseName: "",
        current: 1,
        size: 10
      },
      total: 0,
      loading: false,
      dialogVisible: false,
      roleIdList: [],
      roleList: [],
      courseId: ""
    };
  },
  created() {
    this.loadCourses();
  },
  methods: {
    onSubmit() {
      this.formInline.current = 1;
      this.loadCourses();
    },
    resetForm() {
      (this.$refs.formInline as any).resetFields();
      this.onSubmit();
    },
    async loadCourses() {
      this.loading = true;

      const { data } = await getQueryCourses(this.formInline);
      this.loading = false;
      if (data.code !== "000000") {
        this.$message.error(data.mesg);
        return;
      }
      data.data.records.forEach((item: any) => {
        item.isStatusLoading = false;
      });
      this.courses = data.data.records;
      this.total = data.data.total;
    },

    handleSizeChange(val: number) {
      this.formInline.size = val;
      this.formInline.current = 1;
      this.loadCourses();
    },
    handleCurrentChange(val: number) {
      this.formInline.current = val;
      this.loadCourses();
    },
    async handleStatus(item: any) {
      item.isStatusLoading = true;
      await changeState({
        courseId: item.id,
        status: item.status
      });
      item.isStatusLoading = false;

      this.$message.success(item.staues === 0 ? "下架成功" : "上架成功");
      this.loadCourses();
    }
  }
});
</script>
