import request, {CustomAxiosRequestConfig} from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CourseBaseVO, CourseBaseForm, CourseBaseQuery } from '@/api/course/types';


/**
 * 查询课程列表
 * @param query
 * @returns {*}
 */
export const listBase = (query?: CourseBaseQuery): AxiosPromise<CourseBaseVO[]> => {
  return request({
    url: '/course/audit/list',
    method: 'get',
    params: query
  });
};


/**
 * 课程审核通过
 * @param id
 * @returns {*}
 */
export const coursePass = (id: number | string): AxiosPromise<any> => {
  return request(<CustomAxiosRequestConfig>{
    url: '/course/audit/pass',
    method: 'get',
    params: {"id":id},
    successMsg: true
  });
};

/**
 * 课程审核通过
 * @returns {*}
 * @param rejectBo
 */
export const courseReject = (rejectBo:any): AxiosPromise<any> => {
  return request(<CustomAxiosRequestConfig>{
    url: '/course/audit/reject',
    method: 'put',
    data: rejectBo,
    successMsg: true
  });
};
