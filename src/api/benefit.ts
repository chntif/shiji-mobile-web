/**
 * 用户权益相关接口
 */

import { request } from '@/utils/request'
import type { UserBenefit } from '@/types/benefit'

/**
 * 获取用户权益信息
 */
export const getUserBenefit = () => {
    return request.get<UserBenefit>('/app/benefit/info')
}

