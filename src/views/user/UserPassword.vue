<script setup>
// 匯入樣板元件PageContainer
import PageContainer from '@/components/PageContainer.vue'
// 分別匯入ref函數
import { ref } from 'vue'
// import { ElMessage } from 'element-plus'
// 匯入預封裝api函數
import { userUpdatePasswordService } from '@/api/user.js'
// 分別匯入倉庫模組，待實例化後使用倉庫中方法和操作倉庫數據
import { useUserStore } from '@/stores'
// 分別匯入路由器函數，待實例化後使用路由跳轉方法
import { useRouter } from 'vue-router'
// 保存表單元件實例
const formRef = ref()
// prompt 中須提供
// 保存密碼表單數據
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
// 自訂校驗規則1
const validateNewPwd = (rule, value, callback) => {
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密碼不能與原密碼相同'))
  } else {
    callback()
  }
}
// 自訂校驗規則2
const validateRePwd = (rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('確認密碼需與新密碼相同'))
  } else {
    callback()
  }
}

// 輸入內容校驗規則
const rules = {
  old_pwd: [
    { required: true, message: '請輸入原密碼', trigger: 'blur' },
    { min: 6, max: 15, message: '密碼長度需在6到15位之間', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '請輸入新密碼', trigger: 'blur' },
    { min: 6, max: 15, message: '密碼長度需在6到15位之間', trigger: 'blur' },
    { validator: validateNewPwd, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '請再次確認新密碼', trigger: 'blur' },
    { min: 6, max: 15, message: '密碼長度需在6到15位之間', trigger: 'blur' },
    { validator: validateRePwd, trigger: 'blur' }
  ]
}

const router = useRouter()
const userStore = useUserStore()
// 送出新密碼按鈕
const submitForm = async () => {
  // console.log('修改密碼')
  // 送出前預校驗
  await formRef.value.validate()
  // 發送修改密碼請求
  await userUpdatePasswordService(pwdForm.value)
  // 提示
  ElMessage.success('修改密碼成功')
  // 密碼修改成功後，退出後台重新登入
  userStore.removeToken() // 清空倉庫的token訊息
  userStore.removeUser() // 清空倉庫與登入者相關訊息
  // 跳轉登入頁
  router.push('/login')
}
// 重設密碼按鈕
const resetForm = () => {
  // console.log('重設密碼')
  formRef.value.resetFields()
}
</script>

<template>
  <PageContainer title="修改密碼">
    <el-row>
      <el-col :span="12">
        <el-form :model="pwdForm" :rules="rules" ref="formRef">
          <el-form-item label="原密碼" prop="old_pwd">
            <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密碼" prop="new_pwd">
            <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="確認密碼" prop="re_pwd">
            <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">修改密碼</el-button>
            <el-button @click="resetForm">重新設定</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </PageContainer>
</template>

<style scoped></style>
