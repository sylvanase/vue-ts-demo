<template>
  <div class="menu-create">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ isEdit ? '编辑' : '添加' }}菜单</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="form.parentId" placeholder="请选择上级菜单">
            <el-option label="无上级菜单" :value="-1"></el-option>
            <el-option
              v-for="item in parentMenuList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标" prop="icon">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="form.shown">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.orderNum" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button v-if="!isEdit" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { createMenu, getEditMenuInfo } from "@/services/menu";

export default Vue.extend({
  name: "MenuCreateOrEdit",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: "",
        href: "",
        icon: "",
        orderNum: 0,
        description: "",
        parentId: -1,
        shown: false
      },
      parentMenuList: [],
      rules: {
        name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        description: [
          { required: true, message: "请输入描述", trigger: "blur" }
        ],
        icon: [{ required: true, message: "请输入前端图标", trigger: "blur" }]
      }
    };
  },
  created() {
    this.loadMenuInfo();
  },
  methods: {
    onSubmit() {
      (this.$refs.form as any).validate(async (valid: boolean) => {
        if (valid) {
          const { data } = await createMenu(this.form);
          console.log(data);
          if (data.code === "000000") {
            // 处理成功
            this.$message.success("提交成功");
            this.$router.back();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      (this.$refs.form as any).resetFields();
    },
    async loadMenuInfo() {
      const { data } = await getEditMenuInfo(this.$route.params.id || -1);
      if (data.data.menuInfo) {
        this.form = data.data.menuInfo;
      }
      if (data.code === "000000") {
        this.parentMenuList = data.data.parentMenuList;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
</style>