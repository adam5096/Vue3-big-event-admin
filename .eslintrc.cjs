/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true, // 單引號
        semi: false, // 無分號
        printWidth: 80, // 每橫行寬度最多80字元
        trailingComma: 'none', // 物件與陣列最後不加逗號
        endOfLine: 'auto' // 換行符號不限制
      }
    ],
    'vue/multi-word-component-names': [
      'warn',
      {
        ignores: ['index'] //vue元件名稱多單字組成(忽略index.vue)
      }
    ],
    'vue/no-setup-props-destructure': ['off'], //關閉props解構檢查
    // 新增 未定義變數 錯誤提示 create-vue@3.6.3 關閉
    'no-undef': 'error'
  },
  // 聲明全域變數，解決ElMessage報錯問題
  globals: {
    ElMessage: 'readonly',
    ElMessageBox: 'readonly',
    ElLoading: 'readonly'
  }
}
