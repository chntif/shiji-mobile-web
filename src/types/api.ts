/**
 * API 响应数据类型定义
 */

/**
 * 通用 API 响应结构
 */
export interface ApiResponse<T = any> {
    code: number
    data: T
    msg: string
}

/**
 * 分页参数
 */
export interface PageParams {
    page: number
    pageSize: number
}

/**
 * 分页响应
 */
export interface PageResponse<T = any> {
    list: T[]
    total: number
    page: number
    pageSize: number
}

// 在此处添加更多类型定义...

