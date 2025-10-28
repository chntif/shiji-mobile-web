/**
 * 支付相关接口
 */

import { request } from '@/utils/request'
import type { JsapiPayParams, JsapiPayResponse } from '@/types/payment'

/**
 * JSAPI 支付接口
 */
export const jsapiPay = (data: JsapiPayParams) => {
    return request.post<JsapiPayResponse>('/app/wechat/pay/jsapi', data)
}

