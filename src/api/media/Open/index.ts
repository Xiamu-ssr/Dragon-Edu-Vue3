import request, {CustomAxiosRequestConfig} from '@/utils/request';
import { AxiosPromise } from 'axios';

export const getFreeChapterVideo = (id: string): AxiosPromise<string> => {
  return request({
    url: '/media/open/chapter/video/' + id,
    method: 'get'
  });
};
