import request, {CustomAxiosRequestConfig} from '@/utils/request';
import { AxiosPromise } from 'axios';
import {PayQRCodeVo} from "@/api/order/pay/type";

export const addFreeCourse = (courseId : number | string): AxiosPromise<any> => {
  return request(<CustomAxiosRequestConfig>{
    url: '/learn/schedule/addFreeCourse/' + courseId,
    method: 'get',
    successMsg: true
  });
};

export const isOwnCourse = (courseId : number | string): AxiosPromise<any> => {
  return request({
    url: '/learn/schedule/isOwnCourse/' + courseId,
    method: 'get',
  });
};
