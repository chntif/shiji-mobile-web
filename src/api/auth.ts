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
 * 登录响应数据（data 字段中的内容）
 */
export interface LoginData {
    access_token: string
    refresh_token?: string | null
    expire_in?: number
    refresh_expire_in?: number | null
    client_id?: string
    openid?: string
    scope?: string | null
}

/**
 * 登录响应结构（完整响应）
 */
export interface LoginResponse {
    code: number
    msg: string
    data: LoginData
}

/**
 * 微信 code 登录
 * @param xcxCode 微信授权码
 */
export const loginByWechatCode = (xcxCode: string) => {
    return request.post<LoginResponse>(
        '/auth/login',
        {
            clientId: '428a8310cd442757ae699df5d894f051',
            grantType: 'xcx',
            tenantId: '000000',
            appid: 'wxb4c306a14fdec381',
            xcxCode
        },
        {
            isToken: false,
            isEncrypt: true,
            repeatSubmit: false
        }
    )
}

