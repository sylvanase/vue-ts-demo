<template>
  <div class="menu">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="$router.push({name: 'menu-create'})">添加菜单</el-button>
      </div>
      <el-table :data="menus" style="width: 100%">
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column prop="name" label="菜单名称"></el-table-column>
        <el-table-column prop="level" label="菜单级数"></el-table-column>
        <el-table-column prop="icon" label="前端图标"></el-table-column>
        <el-table-column prop="orderNum" label="排序"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getAllMenus, delMenu } from "@/services/menu";

export default Vue.extend({
  name: "MenuIndex",
  data() {
    return {
      menus: []
    };
  },
  created() {
    this.loadAllMenus();
  },
  methods: {
    async loadAllMenus() {
      const { data } = await getAllMenus();
      if (data.code === "000000") {
        this.menus = data.data;
      }
    },
    handleEdit(item: any) {
      this.$router.push({
        name: "menu-edit",
        params: {
          id: item.id
        }
      });
    },
    handleDelete(item: any) {
      this.$confirm("确认删除该菜单吗？", "删除提示", {})
        .then(async () => {
          // 确认删除
          const { data } = await delMenu(item.id);
          if (data.code === "000000") {
            // 删除成功需要刷新列表
            this.$message.success("删除成功");
            this.loadAllMenus();
          }
        })
        .catch(err => {
          this.$message.warning("取消删除");
        });
    }
  }
});
</script>

<style lang="scss" scoped></style>
