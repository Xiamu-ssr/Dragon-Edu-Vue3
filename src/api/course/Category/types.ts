export interface CategoryVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 分类名称
   */
  name: string;

  /**
   * 父结点id（第一级的父节点是0，自关联字段id）
   */
  parentid: string | number;

  /**
   * 排序字段
   */
  orderby: number;

  /**
   * 描述
   */
  description: string;

  /**
   * 是否叶子
   */
  isLeaf: number;

}

export interface CategoryForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 分类名称
   */
  name?: string;

  /**
   * 父结点id（第一级的父节点是0，自关联字段id）
   */
  parentid?: string | number;

  /**
   * 排序字段
   */
  orderby?: number;

  /**
   * 描述
   */
  description?: string;

  /**
   * 是否叶子
   */
  isLeaf?: number;

}

export interface CategoryQuery extends PageQuery {
  /**
   * 分类名称
   */
  name?: string;

  /**
   * 父结点id（第一级的父节点是0，自关联字段id）
   */
  parentid?: string | number;

  /**
   * 排序字段
   */
  orderby?: number;

  /**
   * 描述
   */
  description?: string;

  /**
   * 是否叶子
   */
  isLeaf?: number;

}
