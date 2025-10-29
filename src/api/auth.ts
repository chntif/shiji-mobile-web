/**
 * 授权登录相关 API
 */
import { request } from '@/utils/request'

/**
 * 微信授权登录接口参数
 */
export interface WechatLoginParams {
    clientId: string
    grantType: string
    tenantId: string
    appid: string
    xcxCode: string
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
    access_token: string
    expires_in?: number
    token_type?: string
    refresh_token?: string
    user_info?: {
        openid?: string
        nickname?: string
        avatar?: string
        // 其他用户信息
    }
}

/**
 * 微信 code 登录
 * @param xcxCode 微信授权码
 */
export const loginByWechatCode = (xcxCode: string) => {
    return request.post<LoginResponse>('/auth/login', {
        clientId: '428a8310cd442757ae699df5d894f051',
        grantType: 'xcx',
        tenantId: '00000',
        appid: 'wxb4c306a14fdec381',
        xcxCode
    })
}

