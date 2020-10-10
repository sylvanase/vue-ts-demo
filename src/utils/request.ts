import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
  // 配置选项
  // baseurl
  // timeout
})

function redirectLogin(){
  router.push({
    name: 'Login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      // refreshtoken 有效次数为一次，所以多个请求并行时，会出现跳转至login的情况
      refreshtoken: store.state.user.refresh_token
    })
  })
}

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

// 控制刷新状态
let isRfreshing = false;
// 存储刷新token期间的401请求，否则刷新成功后发出的请求数量不对
let requests: any[] = []

// 响应拦截，处理token过期问题
request.interceptors.response.use(function (response) {
  // 2xx状态码
  // 若是自定义错误状态码，错误处理在此进行
  return response
}, async function(error) {
  // 除2xx外的状态码
  // 若使用HTTP状态码，错误处理在此进行
  if(error.response) {
    // 请求收到响应，状态码超出 2xx 范围
    const { status } = error.response
    if(status === 400) {
      Message.error('请求参数错误')
    } else if(status === 401) {
      // 没有提供token、token无效、过期等等
      if(!store.state.user) {
        redirectLogin()
        return Promise.reject(error)
      }
      // 刷新token
      if(!isRfreshing) {
        isRfreshing = true
        // 尝试刷新获取新token，不使用request，而是新创建一个axios实例，避免死循环
        return refreshToken().then(res => {
          if(res.data.success) {
            throw new Error('刷新token失败')
          } 
          // 将新的access_token 更新到容器和本地存储
          store.commit('setUser', res.data.content)
          // 将requests队列中的请求重新发出
          requests.forEach(cb => cb())
          // 重置requests数组
          requests = []
          // 成功将本次失败请求重新发出
          return request(error.config)
        }).catch(err => {
          console.log(err)
          // 将当前登录用户状态清除
          store.commit('setUser', null)
          // 失败跳转登录页重新获取token
          redirectLogin()
          return Promise.reject(error)
        }).finally(()=> {
          // 重置刷新状态
          isRfreshing = false
        })
      }
      // 刷新状态下将请求挂起，放到requests数组中
      return new Promise(resolve => {
        requests.push(()=> {
          resolve(request(error.config))
        })
      })
    } else if(status === 403) {
      Message.error('无权限，请联系管理员')
    } else if(status === 404) {
      Message.error('请求资源不存在')
    } else if (status >= 500) {
      Message.error('服务端错误，请联系管理员')
    }
  } else if (error.request) {
    // 请求发出未收到响应
    // 如网络超时或断开等
    Message.error('请求超时，请刷新重试')
  } else {
    // 设置请求时触发了某个错误
    Message.error(`请求失败：${error.message
    }`)
  }
  return Promise.reject(error)
})



export default request
