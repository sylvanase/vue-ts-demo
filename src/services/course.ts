/**
 * 课程相关请求模块
 */

import request from "@/utils/request";
import qs from "qs";

export const getQueryCourses = (data: any) => {
  return request({
    method: "POST",
    url: "/boss/course/getQueryCourses",
    data
  });
};

export const changeState = (params: any) => {
  return request({
    method: "GET",
    url: "/boss/course/changeState",
    params
  });
};

export const getCourseById = (courseId: number | string) => {
  return request({
    method: "GET",
    url: "/boss/course/getCourseById",
    params: {
      courseId
    }
  });
};

export const saveOrUpdateCourse = (data: any) => {
  return request({
    method: "POST",
    url: "/boss/course/saveOrUpdateCourse",
    data
  });
};

export const upload = (data: any) => {
  return request({
    method: "POST",
    url: "/boss/course/upload",
    data
  });
};
