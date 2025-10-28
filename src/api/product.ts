/**
 * 商品相关接口
 */

import { request } from '@/utils/request'
import type { Product } from '@/types/product'

/**
 * 获取商品列表
 */
export const getProductList = () => {
    return request.get<Product[]>('/app/product/list')
}

