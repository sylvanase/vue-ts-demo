/**
 * 资源相关请求模块
 */

import request from "@/utils/request";
// import store from '@/store'

export const getResourcePages = (data: any) => {
  return request({
    method: "POST",
    url: "/boss/resource/getResourcePages",
    data
  });
};

export const categories = () => {
  return request({
    method: "GET",
    url: "/boss/resource/category/getAll"
  });
};

export const delResources = (id: number) => {
  return request({
    method: "DELETE",
    url: `/boss/resource/${id}`
  });
};

export const editResources = (data: any) => {
  return request({
    method: "POST",
    url: "/boss/resource/saveOrUpdate",
    data
  });
};

export const editCategories = (data: any) => {
  return request({
    method: "POST",
    url: "/boss/resource/category/saveOrderUpdate",
    data
  });
};

export const delCategories = (id: number) => {
  return request({
    method: "DELETE",
    url: `/boss/resource/category/${id}`
  });
};

export const allocateRoleResources = (data: any) => {
  return request({
    method: "POST",
    url: "/boss/allocateRoleResources",
    data
  });
};

export const getRoleResources = (roleId: string | number) => {
  return request({
    method: "GET",
    url: "/boss/resource/getRoleResources",
    params: {
      roleId
    }
  });
};
