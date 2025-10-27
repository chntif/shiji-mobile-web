/**
 * API 请求使用示例
 * 本文件仅供参考，实际使用时可删除
 */

import { setAuthToken, request } from './request'

// ========================================
// 1. 设置 Authorization Token (开发阶段)
// ========================================
// 在应用初始化时或登录成功后调用
export function initAuth() {
    // 方式 1：直接传入 token，会自动添加 "Bearer " 前缀
    setAuthToken('your-token-here')

    // 方式 2：也可以手动传入带 Bearer 前缀的 token（不会重复添加）
    // setAuthToken('Bearer your-token-here')
}

// ========================================
// 2. 在组件中使用 API
// ========================================
export async function exampleInComponent() {
    try {
        // GET 请求
        const userInfo = await request.get('/user/info')
        console.log('用户信息:', userInfo)

        // POST 请求
        const loginResult = await request.post('/login', {
            username: 'admin',
            password: '123456'
        })
        console.log('登录结果:', loginResult)

        // PUT 请求
        const updateResult = await request.put('/user/update', {
            nickname: '新昵称'
        })
        console.log('更新结果:', updateResult)

        // DELETE 请求
        const deleteResult = await request.delete('/user/delete/123')
        console.log('删除结果:', deleteResult)
    } catch (error) {
        // 错误已经在拦截器中统一处理，这里可以做额外处理
        console.error('请求失败:', error)
    }
}

// ========================================
// 3. 带类型定义的请求
// ========================================
interface UserInfo {
    id: number
    username: string
    nickname: string
}

interface LoginParams {
    username: string
    password: string
}

interface LoginResponse {
    token: string
    userInfo: UserInfo
}

export async function exampleWithTypes() {
    // 使用类型约束
    const userInfo = await request.get<UserInfo>('/user/info')
    console.log(userInfo.username)

    const loginResult = await request.post<LoginResponse, LoginParams>(
        '/login',
        {
            username: 'admin',
            password: '123456'
        }
    )
    console.log(loginResult.token)
}

// ========================================
// 4. 在 Vue 组件中使用
// ========================================
/*
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { setAuthToken, request } from '@/utils/request'

const userInfo = ref<any>(null)
const loading = ref(false)

// 初始化时设置 token（自动添加 "Bearer " 前缀）
onMounted(() => {
  setAuthToken('your-token-here')  // 最终会变成 "Bearer your-token-here"
  fetchUserInfo()
})

// 获取用户信息
const fetchUserInfo = async () => {
  loading.value = true
  try {
    const data = await request.get('/user/info')
    userInfo.value = data
  } catch (error) {
    // 错误已统一处理
  } finally {
    loading.value = false
  }
}
</script>
*/

