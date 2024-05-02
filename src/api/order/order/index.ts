import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OrderVO, OrderForm, OrderQuery } from '@/api/order/order/types';

/**
 * 查询订单表列表
 * @param query
 * @returns {*}
 */

export const listOrder = (query?: OrderQuery): AxiosPromise<OrderVO[]> => {
    return request({
        url: '/order/order/list/user',
        method: 'get',
        params: query
    });
};

/**
 * 查询订单表列表
 * @param query
 * @returns {*}
 */

export const listOrderCompany = (query?: OrderQuery): AxiosPromise<OrderVO[]> => {
    return request({
        url: '/order/order/list/company',
        method: 'get',
        params: query
    });
};

/**
 * 查询订单表详细
 * @param id
 */
export const getOrder = (id: string | number): AxiosPromise<OrderVO> => {
    return request({
        url: '/order/order/' + id,
        method: 'get'
    });
};

/**
 * 新增订单表
 * @param data
 */
export const addOrder = (data: OrderForm) => {
    return request({
        url: '/order/order',
        method: 'post',
        data: data
    });
};

/**
 * 修改订单表
 * @param data
 */
export const updateOrder = (data: OrderForm) => {
    return request({
        url: '/order/order',
        method: 'put',
        data: data
    });
};

/**
 * 删除订单表
 * @param id
 */
export const delOrder = (id: string | number | Array<string | number>) => {
    return request({
        url: '/order/order/' + id,
        method: 'delete'
    });
};
