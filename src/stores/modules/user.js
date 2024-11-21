import { userGetInfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
// 使用者模組 token setToken removeToken

export const useUserStore = defineStore(
  'big-user',
  () => {
    // token容器
    const token = ref('')
    // 登入平台時 存入token
    const setToken = (newToken) => {
      token.value = newToken
    }
    // 登出平台時 移除token
    const removeToken = () => {
      token.value = ''
    }

    // 存放當前登入使用者訊息
    const user = ref({})
    // 取得當前登入使用者訊息
    const getUser = async () => {
      const res = await userGetInfoService()
      user.value = res.data.data
    }
    // 退出時 清空登入者訊息
    const removeUser = (obj) => {
      user.value = obj
    }

    // 對外露出
    return {
      token,
      setToken,
      removeToken,
      user,
      getUser,
      removeUser
    }
  },
  {
    persist: true //數據持久化設定
  }
)
