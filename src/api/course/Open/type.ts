import {CourseBaseVO} from "@/api/course/types";

export interface CourseAllVO extends CourseBaseVO, CourseExtraVO{

    createTime: Date,
    updateTime: Date,
    teachplan: TeachplanVO[],
    teacherList: TeacherVO[]
}

export interface CourseExtraVO {
    /**
     * 机构名称
     */
    companyName: string;

    /**
     * 课程标签，用符号,分割
     */
    tags: string;

    /**
     * 课程介绍
     */
    description: string;

    /**
     * 教师id列表，形如[''1'',''2'']
     */
    teachers: string;

    /**
     *
     */
    email: string;

    /**
     *
     */
    qq: string;

    /**
     *
     */
    wechat: string;

    /**
     *
     */
    phone: string;

}

export interface TeachplanVO {
    /**
     * UUID
     */
    id: string | number;

    /**
     * 课程计划名称
     */
    pname: string;

    /**
     * 课程计划父级Id，大章节写"0"
     */
    parentid: string | number;

    /**
     * 层级，分为1、2级
     */
    grade: number;

    /**
     * 排序字段
     */
    orderby: number;

    /**
     * 课程标识
     */
    courseId: string | number;

    /**
     * 媒资id
     */
    mediaId: string | number;

    /**
     * 媒资名称
     */
    mediaName: string;

    /**
     * 是否支持试学或预览（试看）
     */
    isPreview: number;

    chapter: TeachplanVO[]
}

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
