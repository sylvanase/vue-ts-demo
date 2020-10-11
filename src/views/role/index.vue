<template>
  <div class="role">
    <role-list></role-list>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import RoleList from "./components/list.vue";

export default Vue.extend({
  name: "RoleIndex",
  components: {
    RoleList
  }
});
</script>
