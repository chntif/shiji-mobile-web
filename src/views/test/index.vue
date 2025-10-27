<template>
    <div class="test-container">
        <div class="title">技术栈集成验证</div>

        <van-button type="primary" class="test-button">这是一个 Vant 按钮</van-button>
        <van-button type="success" class="test-button">按需引入已生效</van-button>

        <div class="rem-test-box">
            <p>这是一个 REM 适配测试盒子</p>
            <p>我在代码中写的宽度是 300px</p>
            <p>字体大小是 16px</p>
        </div>
    </div>
</template>

<script setup lang="ts">
// 注意：我们没有在这里 import 任何 Vant 组件
</script>

<style scoped lang="scss">
.test-container {
    padding: 16px; // 这里写 px，会被自动转换
    text-align: center;
}

.title {
    font-size: 24px; // 会被转换
    margin-bottom: 20px; // 会被转换
}

.test-button {
    margin: 8px; // 会被转换
}

.rem-test-box {
    width: 300px; // 关键测试点
    margin: 20px auto 0;
    padding: 16px;
    background-color: #f0f8ff;
    border: 1px solid #ccc; // 1px 通常我们希望它保持原样
    border-radius: 8px;

    p {
        font-size: 16px; // 关键测试点
        line-height: 1.5;
        margin: 0;
    }
}
</style>