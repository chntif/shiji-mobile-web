/**
 * 加密解密工具函数
 * @description 实现AES加密、RSA加密等功能，使用crypto-js和jsencrypt库
 */

import CryptoJS from 'crypto-js'
import JSEncrypt from 'jsencrypt'

// RSA公钥
const PUBLIC_KEY =
    'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKoR8mX0rGKLqzcWmOzbfj64K8ZIgOdHnzkXSOVOZbFu/TJhZ7rFAN+eaGkl3C4buccQd/EjEsj9ir7ijT7h96MCAwEAAQ=='

/**
 * 随机生成32位的字符串
 * @returns {string}
 */
const generateRandomString = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const charactersLength = characters.length
    for (let i = 0; i < 32; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

/**
 * 随机生成aes 密钥
 * @returns {CryptoJS.lib.WordArray} AES密钥
 */
export const generateAesKey = (): CryptoJS.lib.WordArray => {
    const key = CryptoJS.enc.Utf8.parse(generateRandomString())
    return key
}

/**
 * Base64编码
 * @param {CryptoJS.lib.WordArray} wordArray - 要编码的WordArray
 * @returns {string} Base64编码结果
 */
export const encryptBase64 = (wordArray: CryptoJS.lib.WordArray): string => {
    try {
        return CryptoJS.enc.Base64.stringify(wordArray)
    } catch (error) {
        console.error('Base64编码失败:', error)
        return wordArray.toString()
    }
}

/**
 * Base64解码
 * @param {string} base64String - 要解码的Base64字符串
 * @returns {CryptoJS.lib.WordArray} 解码结果
 */
export const decryptBase64 = (base64String: string): CryptoJS.lib.WordArray => {
    try {
        return CryptoJS.enc.Base64.parse(base64String)
    } catch (error) {
        console.error('Base64解码失败:', error)
        return CryptoJS.enc.Utf8.parse(base64String)
    }
}

/**
 * 使用密钥对数据进行加密
 * @param {string} message - 要加密的消息
 * @param {CryptoJS.lib.WordArray} aesKey - AES密钥
 * @returns {string} 加密后的字符串
 */
export const encryptWithAes = (
    message: string,
    aesKey: CryptoJS.lib.WordArray
): string => {
    try {
        const encrypted = CryptoJS.AES.encrypt(message, aesKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        })
        return encrypted.toString()
    } catch (error) {
        console.error('AES加密失败:', error)
        return message
    }
}

/**
 * 使用密钥对数据进行解密
 * @param {string} message - 要解密的消息
 * @param {CryptoJS.lib.WordArray} aesKey - AES密钥
 * @returns {string} 解密后的字符串
 */
export const decryptWithAes = (
    message: string,
    aesKey: CryptoJS.lib.WordArray
): string => {
    try {
        const decrypted = CryptoJS.AES.decrypt(message, aesKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        })
        return decrypted.toString(CryptoJS.enc.Utf8)
    } catch (error) {
        console.error('AES解密失败:', error)
        return message
    }
}

/**
 * RSA加密
 * @param {string} txt - 要加密的文本
 * @returns {string | false} 加密后的字符串
 */
export const encryptRsa = (txt: string): string | false => {
    try {
        const encryptor = new JSEncrypt()
        encryptor.setPublicKey(PUBLIC_KEY)
        return encryptor.encrypt(txt)
    } catch (error) {
        console.error('RSA加密失败:', error)
        return false
    }
}

