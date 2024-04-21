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
    url: '/course/mgt/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询课程详细
 * @param id
 */
export const getBase = (id: string | number): AxiosPromise<CourseBaseVO> => {
  return request({
    url: '/course/mgt/' + id,
    method: 'get'
  });
};

export const getOne = (id: string | number) => {
  return request({
    url: '/course/mgt/one',
    method: 'get',
    params: { id:id }
  });
};

export const getTwo = (id: string | number) => {
  return request({
    url: '/course/mgt/two',
    method: 'get',
    params: { id:id }
  });
};

export const getThree = (id: string | number) => {
  return request({
    url: '/course/mgt/three',
    method: 'get',
    params: { id:id }
  });
};

/**
 * 新增课程-第一阶段
 * @param data
 */
export const saveOrUpdateOne = (data: CourseBaseForm) => {
  return request({
    url: '/course/mgt/one',
    method: 'post',
    data: data
  });
};
/**
 * 新增课程-第二阶段
 * @param data
 */
export const saveOrUpdateTwo = (data: any) => {
  return request({
    url: '/course/mgt/two',
    method: 'post',
    data: data
  });
};

/**
 * 新增课程-第三阶段
 * @param data
 */
export const saveOrUpdateThree = (data: any) => {
  return request({
    url: '/course/mgt/three',
    method: 'post',
    data: data
  });
};

/**
 * 删除图片
 * @param data
 */
export const deleteImage = (data: any) => {
  return request({
    url: '/media/media/image/delete',
    method: 'post',
    data: data
  });
};

/**
 * 修改课程
 * @param data
 */
export const updateBase = (data: CourseBaseForm) => {
  return request({
    url: '/course/mgt',
    method: 'put',
    data: data
  });
};

/**
 * 删除课程
 * @param id
 */
export const delBase = (id: string | number | Array<string | number>) => {
  return request({
    url: '/course/mgt/' + id,
    method: 'delete'
  });
};

/**
 * 发布课程
 * @param id
 */
export const publishCourse = (id: string | number) => {
  return request(<CustomAxiosRequestConfig>{
    url: '/course/mgt/publish',
    method: 'get',
    params:{"id":id},
    successMsg:true
  });
};


/**
 * 下架课程
 * @param id
 */
export const offShelfCourse = (id: string | number) => {
  return request(<CustomAxiosRequestConfig>{
    url: '/course/mgt/offShelf',
    method: 'get',
    params:{"id":id},
    successMsg:true
  });
};
