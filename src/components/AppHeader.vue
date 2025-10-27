<template>
  <div class="app-header-wrapper">
    <van-nav-bar
      :title="title"
      fixed
      placeholder
      :border="false"
      class="app-header"
    >
      <template #right>
        <van-icon name="wap-nav" size="20" @click="showMenu = true" />
      </template>
    </van-nav-bar>

    <!-- 右上角菜单 -->
    <van-popup
      v-model:show="showMenu"
      position="top"
      :style="{ 
        marginTop: '46px',
        marginRight: '10px',
        marginLeft: 'auto',
        width: '120px',
        borderRadius: '8px'
      }"
      :overlay="false"
    >
      <div class="menu-list">
        <div class="menu-item" @click="handleLogin">
          <van-icon name="user-o" />
          <span>登录</span>
        </div>
        <div class="menu-item" @click="handleOrders">
          <van-icon name="orders-o" />
          <span>订单</span>
        </div>
        <div class="menu-item" @click="handleLogout">
          <van-icon name="sign" />
          <span>退出</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps<{
  title: string
}>()

const router = useRouter()
const showMenu = ref(false)

const handleLogin = () => {
  showMenu.value = false
  // TODO: 跳转登录页或打开登录弹窗
  console.log('登录')
}

const handleOrders = () => {
  showMenu.value = false
  router.push('/orders')
}

const handleLogout = () => {
  showMenu.value = false
  // TODO: 退出登录逻辑
  console.log('退出登录')
}
</script>

<style scoped lang="scss">
.app-header-wrapper {
  :deep(.app-header) {
    background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
    
    .van-nav-bar__title {
      color: #fff;
      font-weight: 600;
      font-size: 18px;
    }

    .van-icon {
      color: #fff;
    }
  }
}

.menu-list {
  padding: 8px 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #f5f7fa;
  }

  &:active {
    background: #e8eaf0;
  }

  .van-icon {
    font-size: 18px;
    color: #666;
    margin-right: 8px;
  }

  span {
    font-size: 14px;
    color: #333;
  }
}
</style>

