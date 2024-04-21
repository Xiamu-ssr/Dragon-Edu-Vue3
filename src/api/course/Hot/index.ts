import request, {CustomAxiosRequestConfig} from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CourseBaseVO, CourseBaseForm, CourseBaseQuery } from '@/api/course/types';


export const hotTest = (): AxiosPromise<any> => {
  return request({
    url: '/course/hot/test',
    method: 'get'
  });
};

export const getESCourseData = (page?: any): AxiosPromise<CourseBaseVO[]> => {
  return request({
    url: '/es/es/list',
    method: 'post',
    data: page
  });
};

export const getHotIds = (): AxiosPromise<[]> => {
  return request({
    url: '/course/hot/ids',
    method: 'get'
  });
};


export const addHot = (id:any): AxiosPromise<[]> => {
  return request(<CustomAxiosRequestConfig>{
    url: '/course/hot/add/'+id,
    method: 'get',
    successMsg: true
  });
};

export const delHot = (id:any): AxiosPromise<[]> => {
  return request(<CustomAxiosRequestConfig>{
    url: '/course/hot/del/'+id,
    method: 'get',
    successMsg: true
  });
};
