export interface StatisticsVO {
    /**
     *
     */
    id: string | number;

    /**
     * 课程id
     */
    courseId: string | number;

    /**
     * 课程名称
     */
    courseName: string;

    /**
     * 课程图片
     */
    pic: string;

    /**
     * 机构id
     */
    companyId: string | number;

    /**
     * 评论数量
     */
    discussCount: number;

    /**
     * 评分-高精度
     */
    star: number;

}

export interface StatisticsForm extends BaseEntity {
    /**
     *
     */
    id?: string | number;

    /**
     * 课程id
     */
    courseId?: string | number;

    /**
     * 课程名称
     */
    courseName?: string;

    /**
     * 课程图片
     */
    pic?: string;

    /**
     * 机构id
     */
    companyId?: string | number;

    /**
     * 评论数量
     */
    discussCount?: number;

    /**
     * 评分-高精度
     */
    star?: number;

}

export interface StatisticsQuery extends PageQuery {
    /**
     * 课程id
     */
    courseId?: string | number;

    /**
     * 课程名称
     */
    courseName?: string;

    /**
     * 课程图片
     */
    pic?: string;

    /**
     * 机构id
     */
    companyId?: string | number;

    /**
     * 评论数量
     */
    discussCount?: number;

    /**
     * 评分-高精度
     */
    star?: number;

}
