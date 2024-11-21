import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// elemt plus 隨選匯入相關設置
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // elemt plus 隨選匯入相關設置
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    // elemt plus 隨選匯入相關設置
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  // base: '/Vue3-big-event-admin/', // 路由基址相關設置
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // vite 優化依賴 & 預編譯
  optimizeDeps: {
    include: [
      '@element-plus/icons-vue',
      '@vueup/vue-quill',
      'axios',
      'element-plus',
      'pinia',
      'pinia-plugin-persistedstate',
      'vue',
      'vue-router'
    ]
  }
})
