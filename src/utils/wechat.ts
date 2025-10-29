/**
 * 微信相关工具函数
 */

/**
 * 检查是否在微信环境中
 */
export const isWechat = (): boolean => {
    const ua = navigator.userAgent.toLowerCase()
    return /micromessenger/.test(ua)
}

/**
 * 检查是否在微信小程序中
 */
export const isMiniProgram = (): Promise<boolean> => {
    return new Promise((resolve) => {
        if (!isWechat()) {
            resolve(false)
            return
        }

        const ua = navigator.userAgent.toLowerCase()
        if (ua.includes('miniprogram')) {
            resolve(true)
        } else {
            // 通过 JSSDK 检测
            if (typeof window.WeixinJSBridge !== 'undefined') {
                window.WeixinJSBridge.invoke('getEnv', {}, (res: any) => {
                    resolve(res.miniprogram === true)
                })
            } else {
                resolve(false)
            }
        }
    })
}

/**
 * 等待微信 JSSDK 加载完成
 */
export const waitForWxJSBridge = (): Promise<void> => {
    return new Promise((resolve) => {
        if (typeof window.WeixinJSBridge !== 'undefined') {
            resolve()
        } else {
            document.addEventListener('WeixinJSBridgeReady', () => {
                resolve()
            })
        }
    })
}

/**
 * 从 URL 中获取微信授权 code
 * @returns code 或 null
 */
export const getWechatCodeFromUrl = (): string | null => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('code')
}

/**
 * 清除 URL 中的授权参数（code 和 state）
 * 避免刷新页面时重复使用 code
 */
export const clearWechatAuthParams = (): void => {
    const url = new URL(window.location.href)
    url.searchParams.delete('code')
    url.searchParams.delete('state')
    window.history.replaceState({}, document.title, url.pathname + url.hash)
}

/**
 * 跳转到微信授权页面
 * @param redirectUri - 授权成功后的回调地址（默认使用当前页面地址）
 */
export const redirectToWechatAuth = (redirectUri?: string): void => {
    // 微信公众号 AppID
    const WECHAT_APPID = 'wxb4c306a14fdec381'

    // 回调地址：如果未指定，使用当前页面的 origin + pathname
    const callbackUri = redirectUri || (window.location.origin + window.location.pathname)

    // 对回调地址进行 URL 编码
    const encodedRedirectUri = encodeURIComponent(callbackUri)

    // 构建微信授权 URL
    const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${WECHAT_APPID}&redirect_uri=${encodedRedirectUri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`

    console.log('跳转到微信授权页面:', authUrl)
    console.log('回调地址:', callbackUri)

    // 跳转到微信授权页面
    window.location.href = authUrl
}

