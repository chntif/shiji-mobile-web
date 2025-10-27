/**
 * API 接口统一管理
 * 所有的 API 请求都应该在此文件中定义
 */

import { request } from '@/utils/request'

/**
 * 示例：获取用户信息
 */
export const getUserInfo = () => {
    return request.get('/user/info')
}

/**
 * 示例：用户登录
 */
export const login = (data: { username: string; password: string }) => {
    return request.post('/login', data)
}

// 在此处添加更多 API 接口...

