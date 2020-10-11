<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="formInline.name" placeholder="请输入资源名称"></el-input>
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input v-model="formInline.url" placeholder="请输入资源路径"></el-input>
          </el-form-item>
          <el-form-item label="资源分类" prop="categoryId">
            <el-select v-model="formInline.categoryId" placeholder="全部" clearable>
              <el-option
                v-for="item in categoryData"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
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
      <el-table :data="resources" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="name" label="资源名称"></el-table-column>
        <el-table-column prop="url" label="资源路径"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="createdTime" label="添加时间">
          <template slot-scope="scope">{{scope.row.createdTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
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
    <!-- 新增和编辑 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      close-on-click-modal
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="资源路径" prop="url">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="资源分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="全部" clearable>
            <el-option
              v-for="item in categoryData"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateResource">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  getResourcePages,
  categories,
  delResources,
  editResources
} from "@/services/resource";

export default Vue.extend({
  name: "ResourceList",
  data() {
    return {
      resources: [],
      formInline: {
        name: "",
        url: "",
        categoryId: "",
        current: 1,
        size: 10
      },
      total: 0,
      categoryData: [],
      loading: false,
      dialogVisible: false,
      form: { id: 0, name: "", url: "", categoryId: 1, description: "" },
      title: "添加资源"
    };
  },
  created() {
    this.loadResources();
    this.loadCategories();
  },
  methods: {
    async loadCategories() {
      const { data } = await categories();
      if (data.code !== "000000") return;
      this.categoryData = data.data;
    },
    onSubmit() {
      this.formInline.current = 1;
      this.loadResources();
    },
    resetForm() {
      (this.$refs.formInline as any).resetFields();
      this.onSubmit();
    },
    async loadResources() {
      this.loading = true;
      const { data } = await getResourcePages(this.formInline);
      this.loading = false;
      this.resources = data.data.records;
      this.total = data.data.total;
    },
    handleEdit(item: any) {
      this.title = "编辑资源";
      this.form = {
        id: item.id,
        name: item.name,
        url: item.url,
        categoryId: item.categoryId,
        description: item.description
      };
      this.dialogVisible = true;
    },
    handleDelete(item: any) {
      this.$confirm("确认删除该资源吗？", "删除提示", {})
        .then(async () => {
          // 确认删除
          const { data } = await delResources(item.id);
          if (data.code === "000000") {
            // 删除成功需要刷新列表
            this.$message.success("删除成功");
            this.loadResources();
          }
        })
        .catch(err => {
          this.$message.warning("取消删除");
        });
    },
    handleSizeChange(val: number) {
      this.formInline.size = val;
      this.formInline.current = 1;
      this.loadResources();
    },
    handleCurrentChange(val: number) {
      this.formInline.current = val;
      this.loadResources();
    },
    // 添加资源
    handleAdd() {
      this.dialogVisible = true;
      console.log(this.form);
    },
    handleClose() {
      this.form = {
        id: 0,
        name: "",
        url: "",
        categoryId: 1,
        description: ""
      };
      // (this.$refs.form as any).resetFields();
      this.dialogVisible = false;
    },
    // 资源分类页
    categoryPage() {
      console.log(1);
      this.$router.push({
        name: "resource-category"
      });
    },
    async updateResource() {
      const formData = { ...this.form };
      if (formData.id === 0) {
        delete formData.id;
      }
      await editResources(formData);
      this.dialogVisible = false;
      // 新增成功刷新表格
      this.onSubmit();
    }
  }
});
</script>
