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
