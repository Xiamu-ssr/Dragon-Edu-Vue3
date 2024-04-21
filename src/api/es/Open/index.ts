import request, {CustomAxiosRequestConfig} from '@/utils/request';
import { AxiosPromise } from 'axios';
import {CourseBaseVO} from "@/api/course/types";

export const getESCourseData = (page?: any): AxiosPromise<CourseBaseVO[]> => {
  return request({
    url: '/es/open/list',
    method: 'post',
    data: page
  });
};
