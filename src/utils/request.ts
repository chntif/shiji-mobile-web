import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { showToast } from 'vant'

// 固定的 clientid
const CLIENT_ID = '428a8310cd442757ae699df5d894f051'

// Token 存储 key
const TOKEN_KEY = 'user_token'

/**
 * 获取当前 Authorization Token
 * 优先从 localStorage 读取持久化的 token
 */
export const getAuthToken = (): string => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
        // 如果 token 已经包含 Bearer 前缀，直接使用；否则添加前缀
        return token.startsWith('Bearer ') ? token : `Bearer ${token}`
    }
    return ''
}

/**
 * 设置 Authorization Token 并持久化到 localStorage
 * @param token - 认证令牌（会自动添加 "Bearer " 前缀，如果已有则不重复添加）
 */
export const setAuthToken = (token: string) => {
    if (token) {
        // 如果 token 已经包含 Bearer 前缀，直接使用；否则添加前缀
        const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`
        localStorage.setItem(TOKEN_KEY, formattedToken)
    } else {
        localStorage.removeItem(TOKEN_KEY)
    }
}

/**
 * 清除 Authorization Token
 */
export const clearAuthToken = () => {
    localStorage.removeItem(TOKEN_KEY)
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

        // 添加 Authorization（从 localStorage 读取持久化的 token）
        const token = getAuthToken()
        if (token) {
            config.headers.Authorization = token
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
        let shouldRedirectToAuth = false

        if (error.response) {
            switch (error.response.status) {
                case 401:
                    message = '未授权，请重新登录'
                    shouldRedirectToAuth = true
                    break
                case 403:
                    message = '权限不足，请重新授权'
                    shouldRedirectToAuth = true
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

        // 如果是权限问题，清除 token 并跳转到授权页面
        if (shouldRedirectToAuth) {
            clearAuthToken()

            // 延迟跳转，让用户看到提示信息
            setTimeout(() => {
                // 动态导入避免循环依赖
                import('@/utils/wechat').then(({ redirectToWechatAuth, isWechat }) => {
                    if (isWechat()) {
                        redirectToWechatAuth()
                    }
                })
            }, 1500)
        }

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

