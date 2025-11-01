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

            <!-- 调试信息输出框 -->
            <div class="debug-box">
                <div class="debug-title">
                    <span>调试信息</span>
                    <van-button v-if="debugLogs.length > 0" size="mini" plain type="primary" @click="clearDebugLogs">
                        清空
                    </van-button>
                </div>
                <div class="debug-content">
                    <div v-for="(log, index) in debugLogs" :key="index" class="debug-item">
                        <div class="debug-header">
                            <span class="debug-time">{{ log.time }}</span>
                            <span :class="['debug-label', log.type]">{{ log.label }}</span>
                        </div>

                        <!-- 如果是请求详情，分块展示 -->
                        <div v-if="log.requestDetail" class="request-detail">
                            <div class="detail-section">
                                <div class="section-header" @click="toggleSection(log.id, 'general')">
                                    <van-icon :name="sectionExpanded(log.id, 'general') ? 'arrow-down' : 'arrow'" />
                                    <span>General</span>
                                </div>
                                <div v-if="sectionExpanded(log.id, 'general')" class="section-content">
                                    <div class="detail-row">
                                        <span class="detail-key">Request URL:</span>
                                        <span class="detail-value">{{ log.requestDetail.url }}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-key">Request Method:</span>
                                        <span class="detail-value">{{ log.requestDetail.method }}</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-key">Status Code:</span>
                                        <span class="detail-value" :class="getStatusClass(log.requestDetail.status)">
                                            {{ log.requestDetail.status }} {{ log.requestDetail.statusText }}
                                        </span>
                                    </div>
                                    <div class="detail-row" v-if="log.requestDetail.duration">
                                        <span class="detail-key">Time:</span>
                                        <span class="detail-value">{{ log.requestDetail.duration }}ms</span>
                                    </div>
                                </div>
                            </div>

                            <div class="detail-section">
                                <div class="section-header" @click="toggleSection(log.id, 'requestHeaders')">
                                    <van-icon
                                        :name="sectionExpanded(log.id, 'requestHeaders') ? 'arrow-down' : 'arrow'" />
                                    <span>Request Headers</span>
                                </div>
                                <div v-if="sectionExpanded(log.id, 'requestHeaders')" class="section-content">
                                    <div v-for="(value, key) in log.requestDetail.requestHeaders" :key="key"
                                        class="detail-row">
                                        <span class="detail-key">{{ key }}:</span>
                                        <span class="detail-value">{{ value }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="detail-section" v-if="log.requestDetail.requestData">
                                <div class="section-header" @click="toggleSection(log.id, 'requestPayload')">
                                    <van-icon
                                        :name="sectionExpanded(log.id, 'requestPayload') ? 'arrow-down' : 'arrow'" />
                                    <span>Request Payload</span>
                                </div>
                                <div v-if="sectionExpanded(log.id, 'requestPayload')" class="section-content">
                                    <pre class="json-content">{{ formatJson(log.requestDetail.requestData) }}</pre>
                                </div>
                            </div>

                            <div class="detail-section" v-if="log.requestDetail.responseHeaders">
                                <div class="section-header" @click="toggleSection(log.id, 'responseHeaders')">
                                    <van-icon
                                        :name="sectionExpanded(log.id, 'responseHeaders') ? 'arrow-down' : 'arrow'" />
                                    <span>Response Headers</span>
                                </div>
                                <div v-if="sectionExpanded(log.id, 'responseHeaders')" class="section-content">
                                    <div v-for="(value, key) in log.requestDetail.responseHeaders" :key="key"
                                        class="detail-row">
                                        <span class="detail-key">{{ key }}:</span>
                                        <span class="detail-value">{{ value }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="detail-section" v-if="log.requestDetail.responseData">
                                <div class="section-header" @click="toggleSection(log.id, 'responseData')">
                                    <van-icon
                                        :name="sectionExpanded(log.id, 'responseData') ? 'arrow-down' : 'arrow'" />
                                    <span>Response</span>
                                </div>
                                <div v-if="sectionExpanded(log.id, 'responseData')" class="section-content">
                                    <pre class="json-content">{{ formatJson(log.requestDetail.responseData) }}</pre>
                                </div>
                            </div>

                            <div class="detail-section" v-if="log.requestDetail.error">
                                <div class="section-header" @click="toggleSection(log.id, 'error')">
                                    <van-icon :name="sectionExpanded(log.id, 'error') ? 'arrow-down' : 'arrow'" />
                                    <span class="error-text">Error</span>
                                </div>
                                <div v-if="sectionExpanded(log.id, 'error')" class="section-content">
                                    <pre class="json-content error-text">{{ formatJson(log.requestDetail.error) }}</pre>
                                </div>
                            </div>
                        </div>

                        <!-- 普通日志文本 -->
                        <pre v-else class="debug-text">{{ log.message }}</pre>
                    </div>
                    <div v-if="debugLogs.length === 0" class="debug-empty">暂无调试信息</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import 'vant/es/toast/style'
import { isWechat, getWechatCodeFromUrl, clearWechatAuthParams, redirectToWechatAuth } from '@/utils/wechat'
import { loginByWechatCode } from '@/api/auth'
import { setAuthToken, addRequestListener, type RequestDetail } from '@/utils/request'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(true)
const loadingText = ref('正在授权...')
const error = ref(false)
const errorMessage = ref('')

// 调试日志
interface DebugLog {
    id: string
    time: string
    type: 'info' | 'success' | 'error' | 'warning'
    label: string
    message?: string
    requestDetail?: RequestDetail
}
const debugLogs = ref<DebugLog[]>([])

// 展开的区块状态
const expandedSections = ref<Record<string, Set<string>>>({})

/**
 * 添加调试日志
 */
const addDebugLog = (type: DebugLog['type'], label: string, message: any, requestDetail?: RequestDetail) => {
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`

    const logId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    debugLogs.value.unshift({
        id: logId,
        time,
        type,
        label,
        message: requestDetail ? undefined : (typeof message === 'object' ? JSON.stringify(message, null, 2) : String(message)),
        requestDetail
    })

    // 如果是请求详情，默认展开 general 和 responseData
    if (requestDetail) {
        expandedSections.value[logId] = new Set(['general', 'responseData'])
    }
}

/**
 * 清空调试日志
 */
const clearDebugLogs = () => {
    debugLogs.value = []
    expandedSections.value = {}
}

/**
 * 切换区块展开/收起
 */
const toggleSection = (logId: string, section: string) => {
    if (!expandedSections.value[logId]) {
        expandedSections.value[logId] = new Set()
    }

    if (expandedSections.value[logId].has(section)) {
        expandedSections.value[logId].delete(section)
    } else {
        expandedSections.value[logId].add(section)
    }
}

/**
 * 检查区块是否展开
 */
const sectionExpanded = (logId: string, section: string) => {
    return expandedSections.value[logId]?.has(section) || false
}

/**
 * 格式化 JSON
 */
const formatJson = (data: any) => {
    if (typeof data === 'string') {
        try {
            return JSON.stringify(JSON.parse(data), null, 2)
        } catch {
            return data
        }
    }
    return JSON.stringify(data, null, 2)
}

/**
 * 获取状态码样式类
 */
const getStatusClass = (status?: number) => {
    if (!status) return ''
    if (status >= 200 && status < 300) return 'status-success'
    if (status >= 400) return 'status-error'
    return ''
}

// 请求监听器的清理函数
let removeRequestListener: (() => void) | null = null

/**
 * 使用微信 code 登录
 */
const loginWithCode = async (code: string) => {
    try {
        loadingText.value = '正在登录...'
        loading.value = true
        error.value = false

        console.log('使用 code 登录:', code)
        addDebugLog('info', '获取到 Code', code)

        // 🔥 重要：立即清除 URL 中的 code 参数，防止重复使用
        // 微信的 code 只能使用一次，使用后必须清除
        clearWechatAuthParams()
        addDebugLog('info', '清除 URL 中的 Code', '已从 URL 中移除 code 参数，防止重复使用')

        // 调用登录接口（请求详情会通过监听器自动记录）
        const response = await loginByWechatCode(code)

        console.log('登录响应:', response)

        // 打印完整的登录接口返回数据
        addDebugLog('success', '登录接口返回数据', response)

        // 🔥 接口返回的数据结构：{ code: 200, msg: "操作成功", data: { access_token: "..." } }
        // 所以需要从 response.data 中获取 access_token
        const tokenData = response.data || response // 兼容两种可能的返回结构
        const accessToken = tokenData.access_token

        addDebugLog('info', '解析 Token 数据', {
            原始响应: response,
            Token数据: tokenData,
            access_token存在: !!accessToken
        })

        // 保存 token
        if (accessToken) {
            setAuthToken(accessToken)
            userStore.setToken(accessToken)

            addDebugLog('success', '保存 Token', {
                token: accessToken,
                tokenPreview: `${accessToken.substring(0, 30)}...`,
                expiresIn: tokenData.expire_in || '未提供',
                openid: tokenData.openid || '未提供',
                clientId: tokenData.client_id || '未提供'
            })

            showToast({
                message: '登录成功',
                position: 'top'
            })

            // 延迟跳转，让用户看到成功提示
            setTimeout(() => {
                // 获取重定向地址（如果有的话）
                const redirect = route.query.redirect as string || '/'
                addDebugLog('info', '准备跳转', `跳转到: ${redirect}`)
                router.replace(redirect)
            }, 2000) // 增加延迟，让用户有时间查看请求详情
        } else {
            addDebugLog('error', '登录失败', {
                message: '响应中未包含 access_token',
                响应结构: response,
                data字段: response.data
            })
            throw new Error('未获取到 access_token')
        }
    } catch (err: any) {
        console.error('登录失败:', err)

        // 打印完整的错误信息
        addDebugLog('error', '登录失败 - 详细错误', {
            message: err.msg || err.message || '登录失败',
            code: err.code,
            response: err.response?.data,
            fullError: err
        })

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
    addDebugLog('info', '检查微信环境', `是否在微信中: ${isInWechat}`)

    if (!isInWechat) {
        error.value = true
        errorMessage.value = '请在微信中打开'
        loading.value = false
        addDebugLog('warning', '环境检查失败', '当前不在微信环境中')
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
    addDebugLog('info', '开始授权流程', {
        callbackUri: finalCallbackUri,
        redirect: redirect || '无'
    })

    // 跳转到微信授权页面
    setTimeout(() => {
        addDebugLog('info', '跳转授权页', '即将跳转到微信授权页面...')
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
    addDebugLog('warning', '重新授权', '清除旧的授权信息，准备重新获取授权')

    // 强制重新开始授权流程（不检查 URL 中的 code，直接跳转授权页面）
    startAuth()
}

/**
 * 检查授权状态
 */
const checkAuthStatus = () => {
    addDebugLog('info', '页面初始化', '开始检查授权状态')

    // 如果已经登录，直接跳转
    if (userStore.isLogin()) {
        console.log('用户已登录，跳转到目标页面')
        addDebugLog('success', '已登录', '用户已登录，准备跳转')
        const redirect = route.query.redirect as string || '/'
        router.replace(redirect)
        return
    }

    // 检查 URL 中是否有 code
    const code = getWechatCodeFromUrl()

    // 解析 URL 参数，显示详细信息
    const urlParams = new URLSearchParams(window.location.search)
    const allParams: Record<string, string> = {}
    urlParams.forEach((value, key) => {
        allParams[key] = value
    })

    addDebugLog('info', '检查 URL 参数', {
        完整URL: window.location.href,
        所有URL参数: allParams,
        是否有code: !!code,
        code值: code || '未获取到',
        code长度: code?.length || 0
    })

    if (code) {
        // 有 code，执行登录
        console.log('检测到授权码，开始登录')
        addDebugLog('success', '检测到授权码', {
            message: '准备使用 Code 登录',
            code: code,
            提示: 'Code 只能使用一次，使用后会立即清除'
        })
        loginWithCode(code)
    } else {
        // 无 code，开始授权流程
        console.log('无授权码，开始授权流程')
        addDebugLog('warning', '未检测到授权码', '准备跳转到微信授权页面获取新的 Code')
        startAuth()
    }
}

// 页面加载时检查授权状态
onMounted(() => {
    // 添加请求监听器
    removeRequestListener = addRequestListener((requestDetail) => {
        const type = requestDetail.error ? 'error' : 'success'
        const label = requestDetail.error ? 'API 请求失败' : 'API 请求成功'

        addDebugLog(type, label, '', requestDetail)
    })

    checkAuthStatus()
})

// 组件卸载时清理监听器
onUnmounted(() => {
    if (removeRequestListener) {
        removeRequestListener()
    }
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

.debug-box {
    margin-top: 30px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 12px;
    padding: 16px;
    backdrop-filter: blur(10px);
    max-height: 500px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.debug-title {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;

    :deep(.van-button) {
        height: 24px;
        padding: 0 12px;
        font-size: 12px;
    }
}

.debug-content {
    overflow-y: auto;
    flex: 1;

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
    }
}

.debug-item {
    margin-bottom: 12px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    border-left: 3px solid #667eea;

    &:last-child {
        margin-bottom: 0;
    }
}

.debug-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.debug-time {
    display: inline-block;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    margin-right: 8px;
    font-family: monospace;
}

.debug-label {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;

    &.info {
        background: rgba(52, 152, 219, 0.3);
        color: #3498db;
    }

    &.success {
        background: rgba(46, 204, 113, 0.3);
        color: #2ecc71;
    }

    &.error {
        background: rgba(231, 76, 60, 0.3);
        color: #e74c3c;
    }

    &.warning {
        background: rgba(241, 196, 15, 0.3);
        color: #f1c40f;
    }
}

.debug-text {
    margin: 6px 0 0 0;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.9);
    white-space: pre-wrap;
    word-break: break-all;
    font-family: 'Courier New', Courier, monospace;
    line-height: 1.5;
}

.debug-empty {
    text-align: center;
    padding: 20px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 13px;
}

// 请求详情样式（类似开发者工具）
.request-detail {
    margin-top: 8px;
}

.detail-section {
    margin-bottom: 8px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    overflow: hidden;

    &:last-child {
        margin-bottom: 0;
    }
}

.section-header {
    display: flex;
    align-items: center;
    padding: 8px 10px;
    background: rgba(255, 255, 255, 0.05);
    cursor: pointer;
    user-select: none;
    transition: background 0.2s;

    &:hover {
        background: rgba(255, 255, 255, 0.08);
    }

    &:active {
        background: rgba(255, 255, 255, 0.1);
    }

    :deep(.van-icon) {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        margin-right: 6px;
        transition: transform 0.2s;
    }

    span {
        font-size: 12px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
    }
}

.section-content {
    padding: 10px;
    animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.detail-row {
    display: flex;
    margin-bottom: 6px;
    font-size: 11px;
    line-height: 1.5;

    &:last-child {
        margin-bottom: 0;
    }
}

.detail-key {
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.6);
    margin-right: 8px;
    font-family: monospace;
}

.detail-value {
    color: rgba(255, 255, 255, 0.9);
    word-break: break-all;
    font-family: monospace;

    &.status-success {
        color: #2ecc71;
        font-weight: 600;
    }

    &.status-error {
        color: #e74c3c;
        font-weight: 600;
    }
}

.json-content {
    margin: 0;
    padding: 8px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.9);
    white-space: pre-wrap;
    word-break: break-all;
    font-family: 'Courier New', Courier, monospace;
    line-height: 1.5;
    max-height: 300px;
    overflow-y: auto;

    &.error-text {
        color: #e74c3c;
    }

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
    }
}

.error-text {
    color: #e74c3c;
}
</style>
