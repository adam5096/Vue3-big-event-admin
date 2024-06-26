// 分別匯入createPinia函數
import { createPinia } from 'pinia'
// 匯入pinia數據持久化插件
import persist from 'pinia-plugin-persistedstate'

// 建立pinia實例
const pinia = createPinia()
// 使用pinia數據持久化插件
pinia.use(persist)
// 預設匯出pinia實例提供外部檔案使用
export default pinia

// 各倉庫模組匯入此地集中 以利後續實現模組倉庫統一匯出
// import { useUserStore } from '@/stores/modules/user.js'
// import { useCountStore } from '@/stores/modules/counter.js'
// 實現模組倉庫統一匯出
// export { useUserStore, useCountStore }
// 簡約寫法 已內含import邏輯
export * from './modules/user'
export * from './modules/counter'
