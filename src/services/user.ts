/**
 * 用户相关请求模块
 */

import request from '@/utils/request'
import qs from 'qs'
// import store from '@/store'

interface User {
  phone: string;
  password: string;
}

export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // 如果data是普通对象，则Content-Type 是application/json
    // 如果data是qs.stringify转换之后的数据： key=value&key=value， 则Content-Type 是 application/x-www-form-urlencoded
    // 如果data是 FormData 对象，则 Content-Type 是 multipart/form-data
    data: qs.stringify(data) // axios 默认发送的是 application/json 格式的数据
  })
}


export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo',
    // headers: {
    //   Authorization: store.state.user.access_token
    // }
  })
}
