import axios from 'axios'
import store from '@/store'
const request = axios.create({
  // 配置选项
  // baseurl
  // timeout
})

// 请求拦截
request.interceptors.request.use(function (config) {
  const { user } = store.state
  if(user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  // 一定要返回config，否则请求会被阻塞
  return config;
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截

export default request
