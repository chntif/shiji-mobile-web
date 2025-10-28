/**
 * 商品相关类型定义
 */

/**
 * 商品信息
 */
export interface Product {
    /**
     * 商品编码
     */
    productCode: string

    /**
     * 商品名称
     */
    productName: string

    /**
     * 商品描述
     */
    productDescription: string

    /**
     * 原价
     */
    originalPrice: string

    /**
     * 是否有可用优惠券
     */
    hasCoupon: boolean

    /**
     * 折后价（如果有优惠券）
     */
    discountPrice: string

    /**
     * 用户优惠券ID
     */
    userCouponId: number | null

    /**
     * 优惠券编码
     */
    couponCode: string | null

    /**
     * 优惠券名称
     */
    couponName: string | null

    /**
     * 优惠券剩余时间（秒）
     */
    couponRemainSeconds: number
}

/**
 * 商品类型枚举
 */
export enum ProductType {
    /** VIP会员套餐 */
    VIP = 'VIP',
    /** 训练卡 */
    CARD = 'CARD'
}

