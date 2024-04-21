import request, {CustomAxiosRequestConfig} from '@/utils/request';
import { AxiosPromise } from 'axios';
import { MediaVO, MediaForm, MediaQuery } from '@/api/media/Media/types';

/**
 * 查询media列表
 * @param query
 * @returns {*}
 */

export const listMedia = (query?: MediaQuery): AxiosPromise<MediaVO[]> => {
  return request({
    url: '/media/media/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询media详细
 * @param id
 */
export const getMedia = (id: string | number): AxiosPromise<MediaVO> => {
  return request({
    url: '/media/media/' + id,
    method: 'get'
  });
};

/**
 * 新增media
 * @param data
 */
export const addMedia = (data: MediaForm) => {
  return request({
    url: '/media/media',
    method: 'post',
    data: data
  });
};

/**
 * 修改media
 * @param data
 */
export const updateMedia = (data: MediaForm) => {
  return request({
    url: '/media/media',
    method: 'put',
    data: data
  });
};

/**
 * 删除media
 * @param id
 */
export const delMedia = (id: string | number | Array<string | number>) => {
  return request({
    url: '/media/media/' + id,
    method: 'delete'
  });
};

export const publishMedia = (ids: [number | string | undefined]) => {
  return request(<CustomAxiosRequestConfig>{
    url: '/media/media/publish',
    method: 'put',
    data: ids,
    successMsg: true
  });
};

/**
 * 上传分块文件
 * */
export const addChunk = (data: any) => {
  return request({
    url: '/media/media/video/chunk',
    method: 'post',
    data: data
  });
};


/**
 * 分块文件是否存在
 * */
export const isChunkExist = (data: any) => {
  return request({
    url: '/media/media/video/chunk',
    method: 'get',
    params: data
  });
};

/**
 * 合并分块文件
 * */
export const mergeChunks = (data: any) => {
  return request({
    url: '/media/media/video/chunk/merge',
    method: 'post',
    data: data
  });
};

