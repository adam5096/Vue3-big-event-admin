import { createApp } from 'vue'

// 匯入根元件 App.vue
import App from './App.vue'
import router from './router'
import pinia from '@/stores/index'
import '@/assets/main.scss'

const app = createApp(App)

// 使用pinia
app.use(pinia)
// 使用路由器
app.use(router)
// vue工作成果掛載到index.html中id為#app的元素內
app.mount('#app')
