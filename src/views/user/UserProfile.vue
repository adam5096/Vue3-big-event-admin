<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
// 取得el-form表單結構實例
const formRef = ref()
// 取得使用者倉庫數據，並從中解構出各屬性與值(初始值，無須響應式)
const {
  user: { email, id, nickname, username },
  getUser
} = useUserStore()
// 將倉庫中使用者數據存到本地原件UserProfile身上
const form = ref({
  id,
  username,
  nickname,
  email
})
// 輸入內容校驗規則
const rules = ref({
  nickname: [
    { required: true, message: '請輸入使用者名稱', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '名稱長度在2~10 非空字元',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '請輸入電子郵件', trigger: 'blur' },
    { type: 'email', message: '請輸入正確電子郵件格式', trigger: ['blur'] }
  ]
})
// 送出按鈕及後續邏輯
const submitForm = async () => {
  // console.log(123)
  // 送出前表單預校驗

  // 使用者暱稱 louisa999
  // 電子郵件 louisa999@itcast.cn
  await formRef.value.validate()
  // 送出修改
  await userUpdateInfoService(form.value)
  // 通知user倉庫，進行數據更新
  getUser()
  // 提示使用者
  ElMessage.success('修改成功')
}
</script>

<template>
  <PageContainer title="基本資料">
    <!-- 表單 -->
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <!-- 登入名稱 -->
      <el-form-item label="登入名稱">
        <el-input v-model="form.username" disabled></el-input>
      </el-form-item>
      <!-- 使用者名稱 -->
      <el-form-item label="使用者名稱" prop="nickname">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <!-- 電子郵件 -->
      <el-form-item label="電子郵件" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <!-- 送出按鈕 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm"> 送出修改 </el-button>
      </el-form-item>
    </el-form>
  </PageContainer>
</template>

<style scoped></style>
