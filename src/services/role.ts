/**
 * 资源相关请求模块
 */

import request from "@/utils/request";
// import store from '@/store'

export const roles = (data: any) => {
  return request({
    method: "POST",
    url: "/boss/role/getRolePages",
    data
  });
};

export const delRole = (id: number) => {
  return request({
    method: "DELETE",
    url: `/boss/role/${id}`
  });
};

export const editRole = (data: any) => {
  return request({
    method: "POST",
    url: "/boss/role/saveOrUpdate",
    data
  });
};
