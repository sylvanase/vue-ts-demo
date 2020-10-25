<template>
  <div class="alloc-menu">
    <el-card>
      <div slot="header">
        <span>分配权限</span>
      </div>
      <el-tree
        ref="menuTree"
        :data="menus"
        default-expand-all
        show-checkbox
        :default-checked-keys="defaultCheckedKeys"
        :props="defaultProps"
        node-key="id"
      ></el-tree>
      <div style="text-align: center">
        <el-button @click="resetTree">清空</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Tree } from "element-ui";
import {
  getMenuNodeList,
  allocateRoleMenus,
  getRoleMenus
} from "@/services/menu";

export default Vue.extend({
  name: "AllocMenu",
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      menus: [],
      defaultProps: {
        children: "subMenuList",
        label: "name"
      },
      defaultCheckedKeys: []
    };
  },
  created() {
    this.getNodeList();
    this.loadRoleMenu();
  },
  methods: {
    async loadRoleMenu() {
      const { data } = await getRoleMenus(this.roleId);
      this.getCheckedKeys(data.data);
    },
    // 处理默认选中的数据
    getCheckedKeys(menus: any) {
      menus.forEach((menu: any) => {
        if (menu.selected) {
          this.defaultCheckedKeys = [
            ...this.defaultCheckedKeys,
            menu.id
          ] as any;
          // this.defaultCheckedKeys.push(menu.id as never);
        }
        if (menu.subMenuList) {
          this.getCheckedKeys(menu.subMenuList);
        }
      });
    },
    async getNodeList() {
      const { data } = await getMenuNodeList();
      this.menus = data.data;
    },
    async onSave() {
      // 拿到选中节点
      const menuIdList = (this.$refs["menuTree"] as Tree).getCheckedKeys();
      // 提交保存
      await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList
      });
      this.$message.success("设置成功");
      this.$router.back();
    },
    resetTree() {
      (this.$refs["menuTree"] as Tree).setCheckedKeys([]);
    }
  }
});
</script>

<style>
</style>