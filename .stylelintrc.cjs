// .stylelintrc.cjs (新配置)
module.exports = {
  extends: ['stylelint-config-standard-vue', 'stylelint-order'],
  customSyntax: 'postcss-html',
  rules: {
    // 例如：禁止使用未知的 @ 规则
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen']
      }
    ],
    // 例如：禁止空的源文件
    'no-empty-source': null
  }
};
