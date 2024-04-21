import request, {CustomAxiosRequestConfig} from '@/utils/request';
import { AxiosPromise } from 'axios';
import {MediaQuery, MediaVO} from '@/api/media/Media/types';


/**
 * 查询课程列表
 * @param query
 * @returns {*}
 */
export const listMedia = (query?: MediaQuery): AxiosPromise<MediaVO[]> => {
  return request({
    url: '/media/audit/list',
    method: 'get',
    params: query
  });
};



/**
 * 通过审核
 * @returns {*}
 * @param id
 */
export const passMedia = (id : number | string | undefined): any => {
  return request({
    url: '/media/audit/pass/' + id,
    method: 'put'
  });
};

/**
 * 不通过审核
 * @returns {*}
 * @param id
 */
export const rejectMedia = (bo : {}) => {
  return request({
    url: '/media/audit/reject',
    method: 'put',
    data: bo
  });
};
