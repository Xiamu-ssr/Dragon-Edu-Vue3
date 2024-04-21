export interface CourseBaseVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 机构ID
   */
  companyId: string | number;

  /**
   * 课程名称
   */
  name: string;

  /**
   * 大分类
   */
  mt: string;

  /**
   * 小分类
   */
  st: string;

  /**
   * 课程图片
   */
  pic: string;

  /**
   * 是否收费
   */
  charge: boolean;

  /**
   * 原价
   */
  originalPrice: number;

  /**
   * 现价
   */
  price: number;

  /**
   * 评分
   */
  star: number;

  /**
   * UNPUBLISHED(1, "未发布"),     UNDER_REVIEW(2, "审核中"),     REVIEW_FAILED(3, "审核不通过"),     REVIEW_PASSED(4, "审核通过")
   */
  status: number;

  /**
   * 审核意见
   */
  mind: string;

}

export interface CourseBaseForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 机构ID
   */
  companyId?: string | number;

  /**
   * 课程名称
   */
  name?: string;

  /**
   * 大分类
   */
  mt?: string;

  /**
   * 小分类
   */
  st?: string;

  /**
   * 课程图片
   */
  pic?: string;

  /**
   * 是否收费
   */
  charge?: boolean;

  /**
   * 原价
   */
  originalPrice?: number;

  /**
   * 现价
   */
  price?: number;

  /**
   * 评分
   */
  star?: number;

  /**
   * UNPUBLISHED(1, "未发布"),     UNDER_REVIEW(2, "审核中"),     REVIEW_FAILED(3, "审核不通过"),     REVIEW_PASSED(4, "审核通过")
   */
  status?: number;

  /**
   * 审核意见
   */
  mind?: string;

}

export interface CourseBaseQuery extends PageQuery {
  /**
   * 机构ID
   */
  companyId?: string | number;

  /**
   * 课程名称
   */
  name?: string;

  /**
   * 大分类
   */
  mt?: string;

  /**
   * 小分类
   */
  st?: string;

  /**
   * 课程图片
   */
  pic?: string;

  /**
   * 是否收费
   */
  charge?: boolean;

  /**
   * 原价
   */
  originalPrice?: number;

  /**
   * 现价
   */
  price?: number;

  /**
   * 评分
   */
  star?: number;

  /**
   * UNPUBLISHED(1, "未发布"),     UNDER_REVIEW(2, "审核中"),     REVIEW_FAILED(3, "审核不通过"),     REVIEW_PASSED(4, "审核通过")
   */
  status?: number;

  /**
   * 审核意见
   */
  mind?: string;

}
