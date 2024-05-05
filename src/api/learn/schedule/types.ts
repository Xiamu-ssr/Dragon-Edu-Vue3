export interface ScheduleVO {
  /**
   *
   */
  id: string | number;

  /**
   * 用户id
   */
  userId: string | number;

  /**
   * 课程id
   */
  courseId: string | number;

  /**
   *
   */
  courseName: string;

  /**
   * 学习时长（分钟）
   */
  learningTime: number;

}

export interface ScheduleForm extends BaseEntity {
  /**
   *
   */
  id?: string | number;

  /**
   * 用户id
   */
  userId?: string | number;

  /**
   * 课程id
   */
  courseId?: string | number;

  /**
   *
   */
  courseName?: string;

  /**
   * 学习时长（分钟）
   */
  learningTime?: number;

}

export interface ScheduleQuery extends PageQuery {
  /**
   * 用户id
   */
  userId?: string | number;

  /**
   * 课程id
   */
  courseId?: string | number;

  /**
   *
   */
  courseName?: string;

  /**
   * 学习时长（分钟）
   */
  learningTime?: number;

}

export interface SimpleStatisticsVo {

  /**
   * 课程数量
   */
  courseCount : number;

  /**
   * 总学习时长
   */
  learnTimeCount : any;
}

