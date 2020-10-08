<template>
  <div id="app">
    <h1>App</h1>
    <!-- 根级路由出口 -->
    <router-view/>
  </div>
</template>
<script>
import Vue from 'vue'
// 1. 准确的类型推断
// 2. 结合编辑器提供的类型及错误提示等辅助功能
export default Vue.extend({
  // 类型推断已启用
  name: 'Button',
  data () {
    return {
      count: 1
    }
  },
  methods: {
    increment () {
      this.count++
    }
  }
})

</script>

<style lang="scss" scoped>
</style>
