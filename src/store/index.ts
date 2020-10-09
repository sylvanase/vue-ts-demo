import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem('user') || 'null')   // 当前登录用户状态
  },
  mutations: {
    // 容器的状态实现了数据共享，在组件里访问方便，但是不持久化
    setUser (state, payload) {
      state.user = JSON.parse(payload)
      // 防止数据丢失，将其放置本地存储
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
