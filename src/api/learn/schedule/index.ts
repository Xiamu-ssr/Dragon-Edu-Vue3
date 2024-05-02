import request, {CustomAxiosRequestConfig} from '@/utils/request';
import { AxiosPromise } from 'axios';
import {PayQRCodeVo} from "@/api/order/pay/types";
import { ScheduleVO, ScheduleForm, ScheduleQuery } from '@/api/learn/schedule/types';

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

export const addLearnTime = (courseId : number | string, learnTime: number): AxiosPromise<any> => {
  return request({
    url: '/learn/schedule/addLearnTime/' + courseId,
    method: 'patch',
    data: {
      learnTime: learnTime
    }
  });
};



/**
 * 查询课程列表
 * @param query
 * @returns {*}
 */

export const listSchedule = (query?: ScheduleQuery): AxiosPromise<ScheduleVO[]> => {
  return request({
    url: '/learn/schedule/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询课程详细
 * @param id
 */
export const getSchedule = (id: string | number): AxiosPromise<ScheduleVO> => {
  return request({
    url: '/learn/schedule/' + id,
    method: 'get'
  });
};

/**
 * 新增课程
 * @param data
 */
export const addSchedule = (data: ScheduleForm) => {
  return request({
    url: '/learn/schedule',
    method: 'post',
    data: data
  });
};

/**
 * 修改课程
 * @param data
 */
export const updateSchedule = (data: ScheduleForm) => {
  return request({
    url: '/learn/schedule',
    method: 'put',
    data: data
  });
};

/**
 * 删除课程
 * @param id
 */
export const delSchedule = (id: string | number | Array<string | number>) => {
  return request({
    url: '/learn/schedule/' + id,
    method: 'delete'
  });
};
