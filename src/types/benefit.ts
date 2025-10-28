/**
 * 用户权益相关类型定义
 */

/**
 * 用户权益信息
 */
export interface UserBenefit {
    /**
     * 主键ID
     */
    id: string

    /**
     * 用户ID
     */
    userId: string

    /**
     * 是否VIP（0-否，1-是）
     */
    isVip: 0 | 1

    /**
     * VIP过期时间
     */
    vipExpireTime: string | null

    /**
     * 永久训练卡余额
     */
    cardBalance: number

    /**
     * 临时训练卡余额
     */
    tempCardBalance: number

    /**
     * 最后一次领取临时卡的日期
     */
    lastCardClaimDate: string | null
}

