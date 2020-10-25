<template>
  <div class="alloc-menu">
    <el-card>
      <div slot="header">
        <span>分配资源</span>
      </div>
      <el-tree
        ref="menuTree"
        :data="resources"
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
import { allocateRoleResources, getRoleResources } from "@/services/resource";

export default Vue.extend({
  name: "AllocResource",
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      resources: [],
      defaultProps: {
        children: "resourceList",
        label: "name"
      },
      defaultCheckedKeys: []
    };
  },
  created() {
    this.loadRoleMenu();
  },
  methods: {
    async loadRoleMenu() {
      const { data } = await getRoleResources(this.roleId);
      data.data.forEach((item: any) => {
        if (item.resourceList) {
          item.id = `${item.id}P`;
        }
      });
      this.resources = data.data;
      this.getCheckedKeys(data.data);
    },
    // 处理默认选中的数据
    getCheckedKeys(resources: any) {
      resources.forEach((resource: any) => {
        if (resource.selected && !resource.resourceList) {
          this.defaultCheckedKeys = [
            ...this.defaultCheckedKeys,
            resource.id
          ] as any;
          // this.defaultCheckedKeys.push(menu.id as never);
        }
        if (resource.resourceList) {
          this.getCheckedKeys(resource.resourceList);
        }
      });
    },
    async onSave() {
      // 拿到选中节点
      const resourceIdList = (this.$refs["menuTree"] as Tree).getCheckedKeys(
        true
      );

      // 提交保存
      await allocateRoleResources({
        roleId: this.roleId,
        resourceIdList
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