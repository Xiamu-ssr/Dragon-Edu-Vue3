export interface CourseQueryBo {
  /**
   * 课程名称
   */
  name : string | undefined;

  /**
  * 大分类
  */
  mt : string | undefined;

  /**
  * 小分类
  */
  st : string | undefined;

  /**
  * 是否收费
  */
  charge : Boolean | undefined;

  isHot : Boolean | undefined;

  orderByParam : OrderByParam;

  pageNum : number;

  pageSize : number;

  total : number;

}

export interface OrderByParam{

  order : string | undefined;
  /**
   * 排序规则 ASC:升序 DESC:降序
   */
  sort : string | undefined;

}
