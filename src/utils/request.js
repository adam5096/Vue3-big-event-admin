import axios from 'axios'
// 分別匯入(隨選、按需)倉庫模組useUserStore
import { useUserStore } from '@/stores/index'
// 分別匯入elemt-plus 提示訊息 元件
import { ElMessage } from 'element-plus'
// 匯入路由器設定檔
import router from '@/router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  // TODO 1. 基礎地址, 逾時時間
  baseURL,
  timeout: 10000
})
// 請求攔截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 攜帶token
    // 實例化倉庫
    const userStore = useUserStore()
    // 如果倉庫內有現存token
    if (userStore.token) {
      // 請求訊息頭部字段
      // Authorization為api文檔指定的key名稱
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)
// 回應攔截器
instance.interceptors.response.use(
  (res) => {
    // TODO 3. 處理業務失敗
    // TODO 4. 抽取核心回應數據
    if (res.data.code === 0) {
      ElMessage({
        message: '請求資料成功',
        type: 'success'
      })
      return res
    }
    // 處理業務失敗, 給錯誤提示, 拋出錯誤
    ElMessage.error(res.data.message || '服務異常')
    return Promise.reject(res.data) // 拋出錯誤
  },
  (err) => {
    // TODO 5. 處理401錯誤
    // 錯誤的 特殊情況 權限不足 或 token過期 => 攔截後頁面跳轉到登錄頁
    if (err.response?.status === 401) {
      router.push('/login')
    }
    // 錯誤的 預設情況
    ElMessage.error(err.response.data.message || '服務異常')
    return Promise.reject(err)
  }
)

// 預設匯出客製化axios實例
export default instance
// 分別匯出基礎地址 以便外部使用
export { baseURL }
