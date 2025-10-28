import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { showToast } from 'vant'

// 固定的 clientid
const CLIENT_ID = '428a8310cd442757ae699df5d894f051'

// 开发阶段 Authorization Token - 可在此处手动设置
let authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJzdHVfdXNlcjoxOTgxOTEyNjgwNTM3Mzg3MDEwIiwicm5TdHIiOiJBQkRTRlYzM0FMYUN1TTY4aFhoVkNEMWNQNERBSHU2aSIsImNsaWVudGlkIjoiNDI4YTgzMTBjZDQ0Mjc1N2FlNjk5ZGY1ZDg5NGYwNTEiLCJleHAiOjE3NjQyMTIyOTIsInRlbmFudElkIjoiMDAwMDAwIiwidXNlcklkIjoxOTgxOTEyNjgwNTM3Mzg3MDEwLCJ1c2VyTmFtZSI6Ind4XzU1NTAxODA4IiwiZGVwdElkIjoxOTY4NjExNjQ4MzUxMzA5ODI1LCJ1c2VyVHlwZSI6InN0dV91c2VyIn0.VFS1mFW-R3ZSlI4pp7xF0xPXegZ6OTSO5Ov0gQsSdgI'

/**
 * 设置 Authorization Token（开发调试用）
 * @param token - 认证令牌（会自动添加 "Bearer " 前缀，如果已有则不重复添加）
 */
export const setAuthToken = (token: string) => {
    // 如果 token 已经包含 Bearer 前缀，直接使用；否则添加前缀
    authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`
}

/**
 * 获取当前 Authorization Token
 */
export const getAuthToken = () => {
    setAuthToken(authToken)
    return authToken
}

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
    baseURL: '/api',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
})

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 添加固定的 clientid
        config.headers.clientid = CLIENT_ID

        // 添加 Authorization（如果已设置，格式：Bearer token）
        if (authToken) {
            config.headers.Authorization = getAuthToken()
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        const { data } = response

        // 根据实际业务调整响应处理逻辑
        // 假设后端返回格式为：{ code: number, data: any, msg: string }
        if (data.code === 200 || data.code === 0) {
            return data
        } else {
            // 业务错误处理
            showToast({
                message: data.msg || '请求失败',
                position: 'top'
            })
            return Promise.reject(data)
        }
    },
    (error) => {
        // HTTP 错误处理
        let message = '网络请求失败'

        if (error.response) {
            switch (error.response.status) {
                case 401:
                    message = '未授权，请重新登录'
                    break
                case 403:
                    message = '拒绝访问'
                    break
                case 404:
                    message = '请求地址不存在'
                    break
                case 500:
                    message = '服务器内部错误'
                    break
                default:
                    message = error.response.data?.msg || message
            }
        } else if (error.message) {
            if (error.message.includes('timeout')) {
                message = '请求超时'
            } else if (error.message.includes('Network Error')) {
                message = '网络连接失败'
            }
        }

        showToast({
            message,
            position: 'top'
        })

        return Promise.reject(error)
    }
)

// 封装请求方法
export const request = {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return instance.get(url, config)
    },

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return instance.post(url, data, config)
    },

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return instance.put(url, data, config)
    },

    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return instance.delete(url, config)
    }
}

export default instance

