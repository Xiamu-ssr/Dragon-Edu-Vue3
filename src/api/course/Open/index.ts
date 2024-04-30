import request, {CustomAxiosRequestConfig} from '@/utils/request';
import { AxiosPromise } from 'axios';
import {CategoryQuery, CategoryVO} from "@/api/course/Category/types";
import {CourseAllVO} from "@/api/course/Open/type";

export const listCategory = (query?: CategoryQuery): AxiosPromise<CategoryVO[]> => {
  return request({
    url: '/course/open/category/list',
    method: 'get',
    params: query
  });
};

export const getCourseAll = (id: number | string | any): AxiosPromise<CourseAllVO[]> => {
  return request({
    url: '/course/publish/courseAll/' + id,
    method: 'get'
  });
};
