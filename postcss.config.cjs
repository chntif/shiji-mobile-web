// postcss.config.cjs
module.exports = {
    plugins: {
        'postcss-pxtorem': {
            // rootValue: 结果 = 设计稿宽度 / 10
            // 我们的设计稿是 375px，所以这里是 37.5
            rootValue: 37.5,
            // 需要转换的 CSS 属性，* 表示全部
            propList: ['*'],
            // 配置不要转换的 CSS 选择器
            selectorBlackList: ['van-']
        },
    },
};