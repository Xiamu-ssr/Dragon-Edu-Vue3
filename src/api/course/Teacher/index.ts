import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { TeacherVO, TeacherForm, TeacherQuery } from '@/api/course/Teacher/types';

/**
 * 查询教师管理列表
 * @param query
 * @returns {*}
 */

export const listTeacher = (query?: TeacherQuery): AxiosPromise<TeacherVO[]> => {
  return request({
    url: '/course/Teacher/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询教师管理详细
 * @param id
 */
export const getTeacher = (id: string | number): AxiosPromise<TeacherVO> => {
  return request({
    url: '/course/Teacher/' + id,
    method: 'get'
  });
};

/**
 * 新增教师管理
 * @param data
 */
export const addTeacher = (data: TeacherForm) => {
  return request({
    url: '/course/Teacher',
    method: 'post',
    data: data
  });
};

/**
 * 修改教师管理
 * @param data
 */
export const updateTeacher = (data: TeacherForm) => {
  return request({
    url: '/course/Teacher',
    method: 'put',
    data: data
  });
};

/**
 * 删除教师管理
 * @param id
 */
export const delTeacher = (id: string | number | Array<string | number>) => {
  return request({
    url: '/course/Teacher/' + id,
    method: 'delete'
  });
};
