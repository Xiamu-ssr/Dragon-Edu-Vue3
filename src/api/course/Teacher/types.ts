export interface TeacherVO {
  /**
   * 教师ID
   */
  id: string | number;

  /**
   * 所属机构id
   */
  companyId: string | number;

  /**
   * 教师姓名
   */
  name: string;

  /**
   * 教师职位
   */
  position: string;

  /**
   * 教师介绍
   */
  introduction: string;

  /**
   * 教师头像
   */
  photograph: string;

}

export interface TeacherForm extends BaseEntity {
  /**
   * 教师ID
   */
  id?: string | number;

  /**
   * 所属机构id
   */
  companyId?: string | number;

  /**
   * 教师姓名
   */
  name?: string;

  /**
   * 教师职位
   */
  position?: string;

  /**
   * 教师介绍
   */
  introduction?: string;

  /**
   * 教师头像
   */
  photograph?: string;

}

export interface TeacherQuery extends PageQuery {
  /**
   * 所属机构id
   */
  companyId?: string | number;

  /**
   * 教师姓名
   */
  name?: string;

  /**
   * 教师职位
   */
  position?: string;

  /**
   * 教师介绍
   */
  introduction?: string;

  /**
   * 教师头像
   */
  photograph?: string;

}
