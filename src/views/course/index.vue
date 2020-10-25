<template>
  <div class="resource">
    <course-list></course-list>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CourseList from "./components/list.vue";

export default Vue.extend({
  name: "CourseIndex",
  components: {
    CourseList
  }
});
</script>

<style lang="scss" scoped></style>
