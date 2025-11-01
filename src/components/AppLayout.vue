<template>
  <div class="app-layout" :class="{ 'is-pc': isPc }">
    <div class="app-container">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isPc = ref(false)

// 检测是否为PC端
const checkDevice = () => {
  // 方法1: 通过 UA 检测
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent)

  // 方法2: 通过屏幕宽度检测（大于 768px 认为是 PC）
  const isLargeScreen = window.innerWidth > 768

  isPc.value = !isMobile && isLargeScreen
}

onMounted(() => {
  checkDevice()
  window.addEventListener('resize', checkDevice)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkDevice)
})
</script>

<style scoped lang="scss">
.app-layout {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  transition: background-color 0.3s ease;

  // 移动端背景
  background: #fff;

  // PC 端背景 - 两侧留白区域
  &.is-pc {
    // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

}

.app-container {
  width: 100%;
  position: relative;
  min-height: 100vh;
  background: #fff;
  margin: 0 auto; // 兜底水平居中

  // 移动端：占满全屏
  @media (max-width: 768px) {
    max-width: 100%;
  }

  // PC 端：限制宽度，模拟手机屏幕
  @media (min-width: 769px) {
    width: 80vw; // 中间约40%为内容区域
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
  }
}
</style>
