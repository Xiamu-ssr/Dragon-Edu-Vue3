export interface OrderVO {
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
     * 金额
     */
    price: number;

    /**
     * 订单状态：1未支付、2支付成功、3支付失败。
     */
    status: number;

    /**
     * 备注
     */
    remarks: string;

    createTime: Date;

}

export interface OrderForm extends BaseEntity {
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
     * 金额
     */
    price?: number;

    /**
     * 订单状态：1未支付、2支付成功、3支付失败。
     */
    status?: number;

    /**
     * 备注
     */
    remarks?: string;

}

export interface OrderQuery extends PageQuery {
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
     * 金额
     */
    price?: number;

    /**
     * 订单状态：1未支付、2支付成功、3支付失败。
     */
    status?: number;

    /**
     * 备注
     */
    remarks?: string;

}
