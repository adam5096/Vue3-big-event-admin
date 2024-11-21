<script setup>
  import PageContainer from '@/components/PageContainer.vue'
  import { ref } from 'vue'
  import { Plus, Upload } from '@element-plus/icons-vue'
  // 根據store數據，初始化imgURL的數據
  import { useUserStore } from '@/stores'
  import { userUpdateAvatarService } from '@/api/user'
  import { ElMessage } from 'element-plus'
  const userStore = useUserStore() // 倉庫user模組數據
  const imgURL = ref(userStore.user.user_pic) // 倉庫數據做為imgURL數據初始化
  const uploadRef = ref() // 上傳元件實例化
  const onSelectFile = (uploadFile) => {
    // 根據File-reader讀取圖片預覽
    // 為配合API要求規格，圖片格式轉為base64
    const reader = new FileReader()
    reader.readAsDataURL(uploadFile.raw)
    reader.onload = () => {
      imgURL.value = reader.result
      // console.log(imgURL.value)
    }
    // imgURL.value = URL.createObjectURL(uploadFile.raw) // 實現上傳圖片預覽
  }
  //
  const onUpdateAvatar = async () => {
    // 發請求更新頭貼
    await userUpdateAvatarService(imgURL.value)
    // 通知倉庫更新頭像
    await userStore.getUser()
    // 提示使用者
    ElMessage.success('更新成功')
  }
</script>

<template>
  <PageContainer title="更換頭貼">
    <el-upload ref="uploadRef" :auto-upload="false" class="avatar-uploader" :show-file-list="false"
      :on-change="onSelectFile">
      <img v-if="imgURL" :src="imgURL" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon">
        <Plus />
      </el-icon>
    </el-upload>

    <!-- uploadRef.$el.querySelector('input').click() -->
    <!-- 可以聽到uploadRef實例中的DOM中的輸入框的點擊事件；實現點擊el-upload與el-button，都能打開選取圖片上傳的視窗 -->
    <!-- 原理︰點擊 button 時，也拿到 upload 元素的真實DOM，在它身上綁單擊事件click -->
    <el-button @click="uploadRef.$el.querySelector('input').click()" type="primary" :icon="Plus"
      size="large">選擇圖片</el-button>
    <el-button @click="onUpdateAvatar" type="success" :icon="Upload" size="large">上傳頭貼</el-button>
  </PageContainer>
</template>

<style lang="scss" scoped>
  .avatar-uploader {
    :deep() {
      .avatar {
        width: 278px;
        height: 278px;
        display: block;
      }

      .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
      }

      .el-upload:hover {
        border-color: var(--el-color-primary);
      }

      .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 278px;
        height: 278px;
        text-align: center;
      }
    }
  }

  .el-button {
    margin-top: 10px;
  }
</style>
