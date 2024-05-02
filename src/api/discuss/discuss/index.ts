import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DiscussVO, DiscussForm, DiscussQuery } from '@/api/discuss/discuss/types';

/**
 * 查询课程评论列表
 * @param query
 * @returns {*}
 */

export const listDiscuss = (query?: DiscussQuery): AxiosPromise<DiscussVO[]> => {
    return request({
        url: '/discuss/discuss/list',
        method: 'get',
        params: query
    });
};

/**
 * 查询课程评论详细
 * @param id
 */
export const getDiscuss = (id: string | number): AxiosPromise<DiscussVO> => {
    return request({
        url: '/discuss/discuss/' + id,
        method: 'get'
    });
};

/**
 * 新增课程评论
 * @param data
 */
export const addDiscuss = (data: DiscussForm) => {
    return request({
        url: '/discuss/discuss',
        method: 'post',
        data: data
    });
};

/**
 * 修改课程评论
 * @param data
 */
export const updateDiscuss = (data: DiscussForm) => {
    return request({
        url: '/discuss/discuss',
        method: 'put',
        data: data
    });
};

/**
 * 删除课程评论
 * @param id
 */
export const delDiscuss = (id: string | number | Array<string | number>) => {
    return request({
        url: '/discuss/discuss/' + id,
        method: 'delete'
    });
};
