<script setup>
// 分別匯入倉庫模組 以利後續操作數據
import { useUserStore } from '@/stores/index.js'
// 分別匯入客製封裝後的qeruest api
import { userRegisterService, userLoginService } from '@/api/user.js'
// 分別匯入ui元件
import { User, Lock } from '@element-plus/icons-vue'
// 分別匯入vue相關函數
import { ref, watch } from 'vue'
// 分別匯入路由器函數
import { useRouter } from 'vue-router'
//true 展示註冊頁 false展示登入頁
const isRegister = ref(true)
// 元件實例
const form = ref()
// 整個用於提交的form表單數據物件(容器)
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
// 整個表單的校驗規則
// 1. 非空校驗 required: true  message 消息提示 trigger 觸發校驗時機 blur change
// 2. 長度校驗 min: xx max: xx
// 3. 正則校驗 pattern: 正則規則 \S 非空校驗
// 4. 自訂校驗 => 自己寫邏輯校驗(校驗函數)
//    validator: (rule, value, callback)
//    (1) rule 當前校驗規則相關訊息
//    (2) value 所校驗的表單元素目前的表單值
//    (3) callback 無論成功或失敗，都需要呼叫callback
//        - callback() 校驗成功
//        - callback(new Error(錯誤訊息)) 校驗失敗
const rules = {
  username: [
    { required: true, message: '請輸入帳號', trigger: 'blur' },
    { min: 5, max: 10, message: '帳號名稱長度必須5~10位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密碼長度必須6-15位元 不能空白鍵',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密碼長度必須6-15位元 不能空白鍵',
      trigger: 'blur'
    },
    {
      // 自定義校驗
      validator: (rule, value, callback) => {
        // 判斷傳入的value與當前form中收集的password是否一致
        if (value !== formModel.value.password) {
          callback(new Error('兩次輸入密碼不一致 請確認其一致'))
        } else {
          callback() //校驗成功也要callback
        }
      },
      trigger: 'blur'
    }
  ]
}
// 註冊邏輯
const register = async () => {
  // 註冊成功之前先進行校驗，校驗成功 > 請求，校驗失敗>自動提示
  ElMessage.success('註冊開始...')
  await form.value.validate()
  ElMessage.success('通過預校驗...')
  await userRegisterService(formModel.value)
  ElMessage.success('註冊成功 切換成登入頁')
  isRegister.value = false //切換登入頁
}
// 倉庫模組實例化
const userStore = useUserStore()
// 路由器實例化
const router = useRouter()
// 登入邏輯
const login = async () => {
  await form.value.validate()
  ElMessage.success('通過預校驗...')
  // await userRegisterService(formModel.value)
  const res = await userLoginService(formModel.value)
  // server回傳資料寫入倉庫存放
  userStore.setToken(res.data.token)
  ElMessage.success('登入成功 切換成導航頁')
  console.log('開始登入', res)
  router.push('/')
}
// 在切換 登入頁 與 註冊頁時 要清空輸入框資料
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
</script>

<template>
  <!-- el-row表示一橫行，一行寬度均分24份
   1. 結構相關
     el-col 表示一直列
     (1) :span="12" 表示一橫行中，占用12份寬
     (2) :span="16" 表示一橫行中，占用6份寬
     (3) :offset="3" 表示一橫行中，左側margin占用3份寬
     el-form 表單元件整體
     el-form-item 表單一橫行(表單域)
     el-input 表單元素(輸入框)
   2. 校驗相關
     (1) el-form => :model="ruleform" 綁定整個form的 數據物件
     (2) el-form => :rules="rules"    綁定的整個rules 規則物件
     (3) 表單元素 => v-model="ruleForm.xxx" 給表單元素，綁定form的子屬性
     (4) el-form-item => prop設置生效的是哪個校驗規則 (與rules中的字樣要對應)
      -->
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 註冊 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <!-- item 1 -->
        <el-form-item>
          <h1>註冊</h1>
        </el-form-item>
        <!-- item 2 -->
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="請輸入帳號"
          ></el-input>
        </el-form-item>
        <!-- item 3 -->
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="請輸入密碼"
          ></el-input>
        </el-form-item>
        <!-- item 4 -->
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="請再次輸入密碼"
          ></el-input>
        </el-form-item>
        <!-- item 5 -->
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            註冊
          </el-button>
        </el-form-item>
        <!-- item 6 -->
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            🠔 返回
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登入 -->
      <!-- 影片展示用v-else 但在我的環境一直報錯 -->
      <!-- 詢問chat-GPT後得到建議解法 v-if="!isRegister" -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="!isRegister"
      >
        <el-form-item>
          <h1>登入</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="請輸入帳號"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="請輸入密碼"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>記住我</el-checkbox>
            <el-link type="primary" :underline="false">忘記密碼?</el-link>
          </div>
        </el-form-item>
        <!-- *** -->
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
          >
            登入
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            註冊 🠖
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
