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

