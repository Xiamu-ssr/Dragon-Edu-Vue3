import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { StatisticsVO, StatisticsForm, StatisticsQuery } from '@/api/discuss/statistics/types';

/**
 * 查询评论统计，机构用列表
 * @param query
 * @returns {*}
 */

export const listStatistics = (query?: StatisticsQuery): AxiosPromise<StatisticsVO[]> => {
    return request({
        url: '/discuss/statistics/list',
        method: 'get',
        params: query
    });
};

/**
 * 查询评论统计，机构用详细
 * @param id
 */
export const getStatistics = (id: string | number): AxiosPromise<StatisticsVO> => {
    return request({
        url: '/discuss/statistics/' + id,
        method: 'get'
    });
};

/**
 * 新增评论统计，机构用
 * @param data
 */
export const addStatistics = (data: StatisticsForm) => {
    return request({
        url: '/discuss/statistics',
        method: 'post',
        data: data
    });
};

/**
 * 修改评论统计，机构用
 * @param data
 */
export const updateStatistics = (data: StatisticsForm) => {
    return request({
        url: '/discuss/statistics',
        method: 'put',
        data: data
    });
};

/**
 * 删除评论统计，机构用
 * @param id
 */
export const delStatistics = (id: string | number | Array<string | number>) => {
    return request({
        url: '/discuss/statistics/' + id,
        method: 'delete'
    });
};
