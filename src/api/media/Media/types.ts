export interface MediaVO {
  /**
   * 文件id,md5值
   */
  id: string | number;

  /**
   * 机构ID
   */
  companyId: string | number;

  /**
   * 原名,只真正的原来的，文件名
   */
  originalName: string;

  /**
   * 文件后缀
   */
  fileSuffix: string;

  /**
   * 文件da
   */
  size: number;

  /**
   * 在minio中的完整路径
   */
  path: string;

  createTime: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 审核状态
   */
  auditStatus: string;

  /**
   * 审核意见
   */
  auditMind: string;

}

export interface MediaForm extends BaseEntity {
  /**
   * 文件id,md5值
   */
  id?: string | number;

  /**
   * 机构ID
   */
  companyId?: string | number;

  /**
   * 原名,只真正的原来的，文件名
   */
  originalName?: string;

  /**
   * 文件后缀
   */
  fileSuffix?: string;

  /**
   * 文件da
   */
  size?: number;

  /**
   * 在minio中的完整路径
   */
  path?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 审核状态
   */
  auditStatus?: string;

  /**
   * 审核意见
   */
  auditMind?: string;

}

export interface MediaQuery extends PageQuery {
  /**
   * 机构ID
   */
  companyId?: string | number;

  /**
   * 原名,只真正的原来的，文件名
   */
  originalName?: string;

  /**
   * 文件后缀
   */
  fileSuffix?: string;

  /**
   * 文件da
   */
  size?: number;

  /**
   * 在minio中的完整路径
   */
  path?: string;

  /**
   * 审核状态
   */
  auditStatus?: string;

  /**
   * 审核意见
   */
  auditMind?: string;

}
