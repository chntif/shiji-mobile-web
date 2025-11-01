<template>
    <div class="auth-page">
        <div class="auth-container">
            <!-- Logo 或品牌图标 -->
            <div class="logo">
                <van-icon name="shield-o" size="60" color="#00b894" />
            </div>

            <!-- 标题 -->
            <h1 class="title">时机</h1>

            <!-- 状态提示 -->
            <div class="status-text">
                <template v-if="loading">
                    <van-loading size="24" vertical>{{ loadingText }}</van-loading>
                </template>
                <template v-else-if="error">
                    <div class="error-msg">
                        <van-icon name="warning-o" size="48" color="#ff6b6b" />
                        <p>{{ errorMessage }}</p>
                        <van-button type="primary" round @click="retryAuth">
                            重新授权
                        </van-button>
                    </div>
                </template>
                <template v-else>
                    <p>正在准备授权...</p>
                </template>
            </div>

            <!-- 提示信息 -->
            <div class="tips">
                <p>· 请在微信中打开使用</p>
                <p>· 授权后即可使用完整功能</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import 'vant/es/toast/style'
import { isWechat, getWechatCodeFromUrl, clearWechatAuthParams, redirectToWechatAuth } from '@/utils/wechat'
import { loginByWechatCode } from '@/api/auth'
import { setAuthToken } from '@/utils/request'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(true)
const loadingText = ref('正在授权...')
const error = ref(false)
const errorMessage = ref('')

/**
 * 使用微信 code 登录
 */
const loginWithCode = async (code: string) => {
    try {
        loadingText.value = '正在登录...'
        loading.value = true
        error.value = false

        console.log('使用 code 登录:', code)

        // 🔥 重要：立即清除 URL 中的 code 参数，防止重复使用
        // 微信的 code 只能使用一次，使用后必须清除
        clearWechatAuthParams()

        // 调用登录接口
        const response = await loginByWechatCode(code)

        console.log('登录响应:', response)

        // 🔥 接口返回的数据结构：{ code: 200, msg: "操作成功", data: { access_token: "..." } }
        // 所以需要从 response.data 中获取 access_token
        const tokenData = response.data || response // 兼容两种可能的返回结构
        const accessToken = tokenData.access_token

        // 保存 token
        if (accessToken) {
            setAuthToken(accessToken)
            userStore.setToken(accessToken)

            showToast({
                message: '登录成功',
                position: 'top'
            })

            // 延迟跳转，让用户看到成功提示
            setTimeout(() => {
                // 获取重定向地址（如果有的话）
                const redirect = route.query.redirect as string || '/'
                router.replace(redirect)
            }, 1500)
        } else {
            throw new Error('未获取到 access_token')
        }
    } catch (err: any) {
        console.error('登录失败:', err)

        error.value = true
        errorMessage.value = err.msg || err.message || '登录失败，请重试'
        loading.value = false

        // 登录失败时，code 已经被使用过了，URL 中的 code 已经在上面被清除
        // 用户需要重新授权才能获取新的 code
    }
}

/**
 * 开始微信授权流程
 */
const startAuth = () => {
    // 检查是否在微信环境
    const isInWechat = isWechat()

    if (!isInWechat) {
        error.value = true
        errorMessage.value = '请在微信中打开'
        loading.value = false
        return
    }

    loadingText.value = '正在跳转授权页面...'

    // 构建回调地址（回到当前授权页）
    const callbackUri = window.location.origin + window.location.pathname

    // 保存原始的重定向地址
    const redirect = route.query.redirect as string
    const finalCallbackUri = redirect
        ? `${callbackUri}?redirect=${encodeURIComponent(redirect)}`
        : callbackUri

    console.log('授权回调地址:', finalCallbackUri)

    // 跳转到微信授权页面
    setTimeout(() => {
        redirectToWechatAuth(finalCallbackUri)
    }, 500)
}

/**
 * 重试授权
 */
const retryAuth = () => {
    error.value = false
    loading.value = true

    // 🔥 重要：重试时必须清除 URL 中可能残留的旧 code
    clearWechatAuthParams()

    // 强制重新开始授权流程（不检查 URL 中的 code，直接跳转授权页面）
    startAuth()
}

/**
 * 检查授权状态
 */
const checkAuthStatus = () => {
    // 如果已经登录，直接跳转
    if (userStore.isLogin()) {
        console.log('用户已登录，跳转到目标页面')
        const redirect = route.query.redirect as string || '/'
        router.replace(redirect)
        return
    }

    // 检查 URL 中是否有 code
    const code = getWechatCodeFromUrl()

    if (code) {
        // 有 code，执行登录
        console.log('检测到授权码，开始登录')
        loginWithCode(code)
    } else {
        // 无 code，开始授权流程
        console.log('无授权码，开始授权流程')
        startAuth()
    }
}

// 页面加载时检查授权状态
onMounted(() => {
    checkAuthStatus()
})
</script>

<style scoped lang="scss">
.auth-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.auth-container {
    text-align: center;
    width: 100%;
    max-width: 400px;
}

.logo {
    margin-bottom: 20px;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
        opacity: 1;
    }

    50% {
        transform: scale(1.05);
        opacity: 0.8;
    }
}

.title {
    font-size: 32px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 40px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.status-text {
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;

    :deep(.van-loading) {
        color: #fff;
    }

    :deep(.van-loading__text) {
        color: #fff;
    }

    p {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
    }
}

.error-msg {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    p {
        font-size: 14px;
        color: #fff;
        margin: 0;
    }

    .van-button {
        background: #fff;
        border-color: #fff;
        color: #667eea;

        &:active {
            background: rgba(255, 255, 255, 0.9);
        }
    }
}

.tips {
    margin-top: 60px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(10px);

    p {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);
        margin: 8px 0;
        line-height: 1.6;
    }
}
</style>
