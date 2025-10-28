/**
 * 格式化工具函数
 */

/**
 * 格式化日期时间
 * @param dateStr 日期字符串
 * @param format 格式 (default: 'YYYY-MM-DD HH:mm')
 * @returns 格式化后的日期字符串
 */
export const formatDateTime = (dateStr: string | null, format = 'YYYY-MM-DD HH:mm'): string => {
    if (!dateStr) return ''

    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds)
}

/**
 * 格式化日期
 * @param dateStr 日期字符串
 * @returns 格式化后的日期字符串 (YYYY-MM-DD)
 */
export const formatDate = (dateStr: string | null): string => {
    return formatDateTime(dateStr, 'YYYY-MM-DD')
}

/**
 * 格式化价格
 * @param price 价格
 * @param decimalPlaces 小数位数 (default: 2)
 * @returns 格式化后的价格字符串
 */
export const formatPrice = (price: number | string, decimalPlaces = 2): string => {
    const num = typeof price === 'string' ? parseFloat(price) : price
    return num.toFixed(decimalPlaces)
}

