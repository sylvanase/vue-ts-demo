<template>
  <div class="category">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="handleAdd()" size="small">添加</el-button>
      </div>
      <el-table :data="categoryData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="createdTime" label="创建时间">
          <template slot-scope="scope">{{scope.row.createdTime | formatDate}}</template>
        </el-table-column>
        <el-table-column prop="url" label="排序"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCategories">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { categories, delCategories, editCategories } from "@/services/resource";

export default Vue.extend({
  name: "CateforiesList",
  data() {
    return {
      categoryData: [],
      loading: false,
      dialogVisible: false,
      form: { id: 0, name: "", sort: 0 },
      title: "添加分类"
    };
  },
  created() {
    this.loadCategories();
  },
  methods: {
    async loadCategories() {
      const { data } = await categories();
      if (data.code !== "000000") return;
      this.categoryData = data.data;
    },

    handleEdit(item: any) {
      this.title = "编辑分类";
      this.form = {
        id: item.id,
        name: item.name,
        sort: item.sort
      };
      this.dialogVisible = true;
    },
    handleDelete(item: any) {
      this.$confirm("确认删除该分类吗？", "删除提示", {})
        .then(async () => {
          // 确认删除
          const { data } = await delCategories(item.id);
          if (data.code === "000000") {
            // 删除成功需要刷新列表
            this.$message.success("删除成功");
            this.loadCategories();
          }
        })
        .catch(err => {
          this.$message.warning("取消删除");
        });
    },
    // 添加资源
    handleAdd() {
      this.title = "添加分类";
      this.dialogVisible = true;
    },
    handleClose() {
      this.form = {
        id: 0,
        name: "",
        sort: 0
      };
      this.dialogVisible = false;
    },

    async updateCategories() {
      const formData = { ...this.form };
      if (formData.id === 0) {
        delete formData.id;
      }
      await editCategories(formData);
      this.dialogVisible = false;
      // 新增成功刷新表格
      this.loadCategories();
    }
  }
});
</script>
