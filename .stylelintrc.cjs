// .stylelintrc.cjs
module.exports = {
  // 继承推荐的规则集
  extends: [
    'stylelint-config-standard-vue', // 处理 .vue 文件中的样式
    'stylelint-config-prettier', // 关闭与 Prettier 冲突的规则
    'stylelint-order' // CSS 属性排序
  ],
  // 指定自定义语法解析器，以支持 .vue 文件
  customSyntax: 'postcss-html',
  // 自定义规则 (可以根据团队规范进行修改)
  rules: {
    // 例如：禁止使用未知的 @ 规则
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen'] // 如果你使用 TailwindCSS，需要忽略这些
      }
    ],
    // 例如：禁止空的源文件
    'no-empty-source': null
    // 其他自定义规则...
  }
};
