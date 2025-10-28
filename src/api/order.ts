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

