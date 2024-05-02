import request, {CustomAxiosRequestConfig} from '@/utils/request';
import { AxiosPromise } from 'axios';
import {PayQRCodeVo} from "@/api/order/pay/types";

export const generatePayCode = (courseId : number | string): AxiosPromise<PayQRCodeVo> => {
  return request({
    url: '/order/orderPay/generatePayCode',
    method: 'get',
    params: {"courseId":courseId}
  });
};

export const queryPayResult = (payNo : number | string): AxiosPromise<any> => {
    return request({
        url: '/order/orderPay/payResult',
        method: 'get',
        params:{"payNo" : payNo}
    });
};

export const queryMQTest = (): AxiosPromise<any> => {
    return request({
        url: '/order/orderPay/testMq',
        method: 'get'
    });
};
