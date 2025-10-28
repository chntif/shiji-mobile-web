/**
 * 支付相关类型定义
 */

/**
 * 支付来源枚举
 */
export enum PaymentSource {
    /** 公众号支付 */
    MP = 'MP',
    /** 小程序支付 */
    MINIAPP = 'MINIAPP'
}

/**
 * JSAPI 支付请求参数
 */
export interface JsapiPayParams {
    /**
     * 商品编码
     */
    productCode: string

    /**
     * 支付来源（可选，默认为 MP）
     */
    paymentSource?: PaymentSource

    /**
     * 用户优惠券ID（可选）
     */
    userCouponId?: number
}

/**
 * JSAPI 支付响应
 */
export interface JsapiPayResponse {
    /**
     * 状态码
     */
    code: string

    /**
     * 消息
     */
    message: string

    /**
     * 商户订单号
     */
    outTradeNo: string

    /**
     * 时间戳
     */
    timeStamp: string

    /**
     * 随机字符串
     */
    nonceStr: string

    /**
     * 订单详情扩展字符串（用于调起微信支付）
     */
    packageValue: string

    /**
     * 签名类型
     */
    signType: string

    /**
     * 签名
     */
    paySign: string

    /**
     * 公众号ID
     */
    appId: string
}

/**
 * 微信支付配置（用于调起支付）
 * 参考文档：https://pay.weixin.qq.com/doc/v3/merchant/4012791857
 */
export interface WxPayConfig {
    /**
     * 应用ID（公众号ID）
     */
    appId: string

    /**
     * 时间戳（注意：S 必须大写）
     */
    timeStamp: string

    /**
     * 随机字符串
     */
    nonceStr: string

    /**
     * 订单详情扩展字符串
     */
    package: string

    /**
     * 签名类型
     */
    signType: string

    /**
     * 签名
     */
    paySign: string
}

