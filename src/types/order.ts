/**
 * 订单相关类型定义
 */

/**
 * 订单状态枚举
 */
export enum OrderStatus {
    /** 待支付 */
    PENDING = 0,
    /** 已支付 */
    PAID = 1,
    /** 已取消 */
    CANCELLED = 2,
    /** 已退款 */
    REFUNDED = 3
}

/**
 * 订单信息
 */
export interface Order {
    /**
     * 商户订单号
     */
    outTradeNo: string

    /**
     * 用户ID
     */
    userId: string

    /**
     * 用户昵称
     */
    nickname: string

    /**
     * 商品编码
     */
    productCode: string

    /**
     * 商品名称
     */
    productName: string

    /**
     * 订单金额（元）
     */
    totalAmount: string

    /**
     * 原始金额（使用优惠券前）
     */
    originalAmount: string

    /**
     * 优惠券编码
     */
    couponCode: string | null

    /**
     * 优惠金额
     */
    couponDiscount: string | null

    /**
     * 订单状态（0-待支付，1-已支付，2-已取消，3-已退款）
     */
    orderStatus: OrderStatus

    /**
     * 订单状态文本
     */
    orderStatusText: string

    /**
     * 微信支付订单号
     */
    transactionId: string

    /**
     * 客户端IP
     */
    clientIp: string

    /**
     * 付款渠道
     */
    paymentChannel: string

    /**
     * 下单时间
     */
    orderTime: string

    /**
     * 支付时间
     */
    paidTime: string | null

    /**
     * 创建时间
     */
    createTime: string

    /**
     * 更新时间
     */
    updateTime: string
}

/**
 * 订单列表响应
 */
export interface OrderListResponse {
    /**
     * 订单列表
     */
    rows: Order[]

    /**
     * 总记录数
     */
    total: number
}

/**
 * 订单列表查询参数
 */
export interface OrderListParams {
    /**
     * 页码
     */
    pageNum?: number

    /**
     * 每页数量
     */
    pageSize?: number

    /**
     * 订单状态（0-待支付，1-已支付，2-已取消，3-已退款）
     */
    orderStatus?: OrderStatus
}

