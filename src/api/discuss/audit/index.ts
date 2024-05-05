import request, {CustomAxiosRequestConfig} from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DiscussVO, DiscussForm, DiscussQuery } from '@/api/discuss/discuss/types';



/**
 * 查询需审核列表
 * @param query
 */
export const listAuditDiscuss = (query?: DiscussQuery): AxiosPromise<DiscussVO[]> => {
  return request({
    url: '/discuss/audit/list',
    method: 'get',
    params: query
  });
};


/**
 * 审核屏蔽
 * @param id
 * @param allow
 */
export const allowForBlock = (id: string | number, allow : boolean) => {
  return request(<CustomAxiosRequestConfig>{
    url: '/discuss/audit/allowForBlock/' + id,
    method: 'get',
    params:{allow:allow},
    successMsg: true
  });
};
