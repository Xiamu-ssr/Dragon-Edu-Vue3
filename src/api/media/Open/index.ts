import request, {CustomAxiosRequestConfig} from '@/utils/request';
import { AxiosPromise } from 'axios';

export const getChapterVideo = (courseId: string | number, teachplanId: string): AxiosPromise<string> => {
  return request({
    url: '/media/videoPlay/getVideoUrl',
    method: 'get',
    params:{"courseId":courseId, "teachplanId":teachplanId}
  });
};
