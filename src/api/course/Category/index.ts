import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CategoryVO, CategoryForm, CategoryQuery } from '@/api/course/Category/types';

/**
 * 查询分类管理列表
 * @param query
 * @returns {*}
 */

export const listCategory = (query?: CategoryQuery): AxiosPromise<CategoryVO[]> => {
  return request({
    url: '/course/category/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询分类管理详细
 * @param id
 */
export const getCategory = (id: string | number): AxiosPromise<CategoryVO> => {
  return request({
    url: '/course/category/' + id,
    method: 'get'
  });
};

/**
 * 新增分类管理
 * @param data
 */
export const addCategory = (data: CategoryForm) => {
  return request({
    url: '/course/category',
    method: 'post',
    data: data
  });
};

/**
 * 修改分类管理
 * @param data
 */
export const updateCategory = (data: CategoryForm) => {
  return request({
    url: '/course/category',
    method: 'put',
    data: data
  });
};

/**
 * 删除分类管理
 * @param id
 */
export const delCategory = (id: string | number | Array<string | number>) => {
  return request({
    url: '/course/category/' + id,
    method: 'delete'
  });
};
