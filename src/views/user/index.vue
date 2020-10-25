<template>
  <div class="resource">
    <user-list></user-list>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import UserList from "./components/list.vue";

export default Vue.extend({
  name: "UserIndex",
  components: {
    UserList
  }
});
</script>

<style lang="scss" scoped></style>
