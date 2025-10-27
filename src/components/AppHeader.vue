<template>
  <div class="app-header-wrapper">
    <!-- 自定义顶部栏 -->
    <div class="custom-header">
      <div class="header-title">{{ title }}</div>
      <div class="header-menu" @click="showMenu = true">
        <div class="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <!-- 占位元素，避免内容被固定的 header 遮挡 -->
    <div class="header-placeholder"></div>

    <!-- 遮罩层 -->
    <div 
      v-if="showMenu" 
      class="menu-overlay" 
      @click="showMenu = false"
    ></div>

    <!-- 右上角菜单 -->
    <transition name="menu-fade">
      <div v-if="showMenu" class="menu-dropdown">
        <div class="menu-list">
          <div class="menu-item" @click="handleHome">
            <van-icon name="shop-o" />
            <span>商品购买</span>
          </div>
          <div class="menu-item" @click="handleOrders">
            <van-icon name="orders-o" />
            <span>订单</span>
          </div>
          <div class="menu-item" @click="handleAuth">
            <van-icon :name="isLogin ? 'sign' : 'user-o'" />
            <span>{{ isLogin ? '退出' : '登录' }}</span>
          </div>
        </div>
      </div>
    </transition>
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
// TODO: 这里应该从状态管理（Pinia）中获取登录状态
const isLogin = ref(false)

// 跳转到商品购买页（主页）
const handleHome = () => {
  showMenu.value = false
  router.push('/')
}

// 跳转到订单页
const handleOrders = () => {
  showMenu.value = false
  router.push('/orders')
}

// 登录/退出
const handleAuth = () => {
  showMenu.value = false
  if (isLogin.value) {
    // TODO: 退出登录逻辑
    console.log('退出登录')
    isLogin.value = false
  } else {
    // TODO: 跳转登录页或打开登录弹窗
    console.log('登录')
  }
}
</script>

<style scoped lang="scss">
.app-header-wrapper {
  // 自定义顶部栏
  .custom-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: linear-gradient(135deg, #00d4aa 0%, #00b894 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    z-index: 999;
    box-shadow: 0 2px 8px rgba(0, 180, 148, 0.2);

    .header-title {
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      flex: 1;
      text-align: center;
      margin-left: 40px; // 平衡右侧菜单按钮的位置
    }

    .header-menu {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: opacity 0.3s;

      &:active {
        opacity: 0.7;
      }

      .menu-icon {
        width: 24px;
        height: 18px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        span {
          display: block;
          width: 100%;
          height: 3px;
          background: #fff;
          border-radius: 2px;
          transition: all 0.3s;
        }
      }
    }
  }

  // 占位元素
  .header-placeholder {
    height: 56px;
  }
}

// 遮罩层
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 998;
}

// 下拉菜单
.menu-dropdown {
  position: fixed;
  top: 66px; // 顶部栏高度 56px + 间距 10px
  right: 10px;
  z-index: 999;
}

.menu-list {
  padding: 8px 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 150px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.3s;
  white-space: nowrap;

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

// 菜单动画
.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: all 0.3s ease;
}

.menu-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

