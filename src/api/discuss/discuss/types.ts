export interface DiscussVO {
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
     * 机构id
     */
    companyId: string | number;

    /**
     * 用户id
     */
    userId: string | number;

    /**
     * 用户名称
     */
    userName: string;

    /**
     * 头像地址url
     */
    avatar: string;

    /**
     * 评论时用户学习时长/分钟
     */
    learnTime: number;

    /**
     * 评分
     */
    star: number;

    /**
     * 评论状态。1正常2申请屏蔽3屏蔽
     */
    status: number;

    createTime: Date;

}

export interface DiscussForm extends BaseEntity {
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
     * 机构id
     */
    companyId?: string | number;

    /**
     * 用户id
     */
    userId?: string | number;

    /**
     * 用户名称
     */
    userName?: string;

    /**
     * 头像地址url
     */
    avatar?: string;

    /**
     * 评论时用户学习时长/分钟
     */
    learnTime?: number;

    /**
     * 评分
     */
    star?: number;

    /**
     * 评论状态。1正常2申请屏蔽3屏蔽
     */
    status?: number;

}

export interface DiscussQuery extends PageQuery {
    /**
     * 课程id
     */
    courseId?: string | number;

    /**
     * 课程名称
     */
    courseName?: string;

    /**
     * 机构id
     */
    companyId?: string | number;

    /**
     * 用户id
     */
    userId?: string | number;

    /**
     * 用户名称
     */
    userName?: string;

    /**
     * 头像地址url
     */
    avatar?: string;

    /**
     * 评论时用户学习时长/分钟
     */
    learnTime?: number;

    /**
     * 评分
     */
    star?: number;

    /**
     * 评论状态。1正常2申请屏蔽3屏蔽
     */
    status?: number;

}
