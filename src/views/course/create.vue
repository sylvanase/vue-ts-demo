<template>
  <div class="course-create">
    <el-card>
      <div slot="header">
        <el-steps :active="activeStep" simple>
          <el-step
            v-for="(item, index) in steps"
            :title="item.title"
            :icon="item.icon"
            :key="index"
            @click.native="activeStep = index"
          ></el-step>
        </el-steps>
      </div>
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <div v-show="activeStep === 0">
          <el-form-item label="名称" prop="courseName">
            <el-input show-word-limit v-model="form.courseName" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="brief">
            <el-input show-word-limit v-model="form.brief" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="讲师姓名" prop="teacherName">
            <el-input show-word-limit v-model="form.teacherName" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="职位" prop="position">
            <el-input show-word-limit v-model="form.position" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介" prop="description">
            <el-input show-word-limit v-model="form.description" maxlength="100"></el-input>
          </el-form-item>
          <el-form-item label="课程概述" prop="name">
            <el-input show-word-limit v-model="form.previewFirstField" maxlength="20"></el-input>
          </el-form-item>
        </div>
        <div v-show="activeStep === 1">cover</div>
        <div v-show="activeStep === 2">sale</div>
        <div v-show="activeStep === 3">active</div>
        <div v-show="activeStep === 4">
          <el-form-item>
            <el-button type="primary" @click="next">保存</el-button>
          </el-form-item>
        </div>
        <el-form-item v-if="activeStep >=0 && activeStep < 4">
          <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "CourseCreate",
  data() {
    return {
      activeStep: 0,
      steps: [
        {
          title: "基本信息",
          icon: "el-icon-info"
        },
        {
          title: "课程封面",
          icon: "el-icon-upload"
        },
        {
          title: "销售信息",
          icon: "el-icon-s-shop"
        },
        {
          title: "秒杀活动",
          icon: "el-icon-coordinate"
        },
        {
          title: "课程详情",
          icon: "el-icon-video-camera"
        }
      ],
      form: {
        courseName: "",
        brief: "",
        teacherName: "",
        position: "",
        description: "",
        previewFirstField: ""
      },
      rules: {
        courseName: [
          { required: true, message: "请输入课程名称", trigger: "blur" }
        ],
        brief: [{ required: true, message: "请输入简介", trigger: "blur" }],
        teacherName: [
          { required: true, message: "请输入讲师姓名", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    next() {
      if (this.activeStep++ > 3) this.activeStep = 0;
    }
  }
});
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}
</style>