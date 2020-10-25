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

export const allocateUserRoles = (data: any) => {
  return request({
    method: "POST",
    url: "/boss/role/allocateUserRoles",
    data
  });
};

export const getRoleAll = () => {
  return request({
    method: "GET",
    url: "/boss/role/all"
  });
};

export const getRoleUser = (userId: string | number) => {
  return request({
    method: "GET",
    url: `/boss/role/user/${userId}`
  });
};
