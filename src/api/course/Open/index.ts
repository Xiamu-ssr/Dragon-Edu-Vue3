import request, {CustomAxiosRequestConfig} from '@/utils/request';
import { AxiosPromise } from 'axios';
import {CategoryQuery, CategoryVO} from "@/api/course/Category/types";

export const listCategory = (query?: CategoryQuery): AxiosPromise<CategoryVO[]> => {
  return request({
    url: '/course/open/category/list',
    method: 'get',
    params: query
  });
};
