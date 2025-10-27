<template>
  <div class="app-layout">
    <div class="app-container">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// PC 端自动居中，H5 端占满宽度
</script>

<style scoped lang="scss">
.app-layout {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  justify-content: center;
}

.app-container {
  width: 100%;
  max-width: 750px;
  background: #fff;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
  position: relative;
  min-height: 100vh;

  @media (max-width: 750px) {
    box-shadow: none;
  }
}
</style>

