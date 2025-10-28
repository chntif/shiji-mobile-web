/**
 * 订单相关接口
 */

import { request } from '@/utils/request'
import type { OrderListResponse, OrderListParams } from '@/types/order'

/**
 * 获取订单列表
 */
export const getOrderList = (params?: OrderListParams) => {
    return request.get<OrderListResponse>('/app/wechat/pay/list', { params })
}

/**
 * 关闭订单
 * @param outTradeNo 商户订单号
 */
export const closeOrder = (outTradeNo: string) => {
    return request.post(`/app/wechat/pay/close/${outTradeNo}`)
}

/**
 * 继续支付（重新拉起支付）
 * @param outTradeNo 商户订单号
 */
export const continuePay = (outTradeNo: string) => {
    return request.post(`/app/wechat/pay/continue-pay/${outTradeNo}`)
}

