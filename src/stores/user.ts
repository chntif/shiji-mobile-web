/**
 * 用户状态管理
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

const TOKEN_KEY = 'user_token'

export const useUserStore = defineStore('user', () => {
    // 用户 token
    const token = ref<string>('')

    /**
     * 初始化 token（从 localStorage 读取）
     */
    const initToken = () => {
        const savedToken = localStorage.getItem(TOKEN_KEY)
        if (savedToken) {
            token.value = savedToken
        }
    }

    /**
     * 设置 token 并持久化
     */
    const setToken = (newToken: string) => {
        token.value = newToken
        if (newToken) {
            localStorage.setItem(TOKEN_KEY, newToken)
        } else {
            localStorage.removeItem(TOKEN_KEY)
        }
    }

    /**
     * 清除 token
     */
    const clearToken = () => {
        token.value = ''
        localStorage.removeItem(TOKEN_KEY)
    }

    /**
     * 判断是否已登录
     */
    const isLogin = () => {
        return !!token.value
    }

    // 初始化时从 localStorage 读取 token
    initToken()

    return {
        token,
        setToken,
        clearToken,
        isLogin
    }
})

