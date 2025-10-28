/**
 * 微信 JSSDK 类型定义
 */

interface WeixinJSBridge {
    invoke: (
        method: string,
        params: any,
        callback: (res: any) => void
    ) => void
    on: (event: string, callback: (res: any) => void) => void
}

interface Window {
    WeixinJSBridge?: WeixinJSBridge
}

