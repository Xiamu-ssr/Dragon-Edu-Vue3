import {AxiosPromise} from "axios/index";
import request from "@/utils/request";
import {TotalStatisticsVo} from "@/api/order/totalStatistics/types";

export const getTotalData = (): AxiosPromise<TotalStatisticsVo> => {
  return request({
    url: '/order/totalStatistics/data',
    method: 'get'
  });
};
