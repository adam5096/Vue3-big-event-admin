<script setup>
  import { ref } from 'vue'
  import ChannelSelect from './ChannelSelect.vue'
  import { Plus } from '@element-plus/icons-vue'
  import { QuillEditor } from '@vueup/vue-quill' // 匯入文本編輯器
  import '@vueup/vue-quill/dist/vue-quill.snow.css' // 匯入文本編輯器
  // 匯入文章取得、新增、編輯api
  import {
    artPublishService,
    artGetDetailService,
    artEditService
  } from '@/api/article.js'
  import { baseURL } from '@/utils/request.js'
  import axios from 'axios'
  // 控制抽屜顯示隱藏
  const visibleDrawer = ref(false)
  // 預設數據
  const defaultForm = {
    title: '', // 標題
    cate_id: '', // 分類id
    cover_img: '', // 封面圖片 file物件
    content: '', // string內容
    state: '' // 狀態
  }
  // 保存表單數據
  const formModel = ref({ ...defaultForm })
  // 保存圖片地址(圖片上傳相關)
  const imgUrl = ref('')
  const onSelectFile = (uploadFile) => {
    // console.log('uploadFile', uploadFile)
    imgUrl.value = URL.createObjectURL(uploadFile.raw)
    console.log('imgUrl', imgUrl.value) // 實現預覽圖片
    formModel.value.cover_img = uploadFile.raw
  }
  // 註冊跨元件監聽事件
  const emit = defineEmits(['success'])
  // 提交送出
  const onPublish = async (state) => {
    // 將已發布或草稿狀態，存入formModel
    formModel.value.state = state
    // console.log('formModel', formModel.value)

    // 注意當前接口 需要的是formData物件
    // 將一般物件 => 轉換成 => formData物件
    const fd = new FormData()
    // 遍歷formModel，把formModel中全部數據塞入fd
    for (let key in formModel.value) {
      // key為0時，放入對應index的formModel屬性值
      fd.append(key, formModel.value[key])
    }

    // 發請求
    if (formModel.value.id) {
      // 編輯操作
      // console.log('編輯')
      await artEditService(fd) // 發請求、傳值
      ElMessage.success('修改成功')
      visibleDrawer.value = false // 關抽屜
      // 通知父元件 新增成功了
      emit('success', 'edit')
    } else {
      // 新增操作
      await artPublishService(fd) // 發請求、傳值
      ElMessage.success('新增成功')
      visibleDrawer.value = false // 關抽屜
      // 通知父元件 新增成功了
      // 參數1: 'success' 表示父組件監聽的事件名稱(用這組名稱喊話給父組件)
      // 參數2: 'add' 表示夾帶給父組件的參數，值為字串'add')
      emit('success', 'add')
    }
  }

  // 因為在 新增文章 與 編輯文章 都共用到彈出對話框功能 故封裝成一個元件以利複用
  // 對外匯出一個方法open， 根據open傳過來的參數， 區分是 新增 或 編輯
  // open({}) => 無須重新渲染表單，說明是 新增操作
  // open({id, cate_name, ... }) => 要重新渲染表單，說明是 編輯操作
  // 呼叫open後，可以打開對話窗(互動窗)

  // 寶編輯器元件是實例
  const editorRef = ref()
  const open = async (row) => {
    visibleDrawer.value = true // 打開抽屜
    // console.log('row', row)
    if (row.id) {
      // 需要根據row.id發請求，取得編輯對應的數據詳情，進行回頭顯示
      // console.log('編輯回顯')
      const res = await artGetDetailService(row.id)
      // console.log('res', res)
      formModel.value = res.data.data

      // 單獨處理圖片回頭顯示
      imgUrl.value = baseURL + formModel.value.cover_img
      // 提交給伺服器的數據格式，是file物件格式
      // 需要將網路圖片地址 => 轉換成file物件後存起來
      const file = await imageURLToFileObject(
        imgUrl.value,
        formModel.value.cover_img
      )
      formModel.value.cover_img = file
    } else {
      formModel.value = { ...defaultForm } // 根據預設數據，重置form數據
      // 這裡重置表單數據，但是圖片上傳img地址，文字編輯器內容 => 要手動重置
      imgUrl.value = ''
      // vue quill 提供的方法 清空重置
      editorRef.value.setHTML('')
      // console.log('新增')
    }
  }
  // 問問ChatGPT 將網路圖片地址轉換成file物件的函數
  async function imageURLToFileObject(imageURL, filename) {
    try {
      const response = await axios.get(imageURL, { responseType: 'arraybuffer' })

      const blob = new Blob([response.data], {
        type: response.headers['content']
      })

      const file = new File([blob], filename, {
        type: response.headers['content']
      })
      return file
    } catch (error) {
      console.error('Error converting image URL to File object:', error)

      return null
    }
  }
  // 對外露出方法 以供父元件使用
  defineExpose({
    open
  })
</script>

<template>
  <!-- 抽屜元件用v-model來控制抽屜顯示隱藏 -->
  <el-drawer v-model="visibleDrawer" :title="formModel.id ? '編輯文章' : '新增文章'" direction="rtl" size="50%"
    :before-close="handleClose">
    <!-- 發表文章表單 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <!-- 標題 -->
      <el-form-item label="文章標題" prop="title">
        <el-input v-model="formModel.title" placeholder="請輸入標題"></el-input>
      </el-form-item>
      <!-- 分類 -->
      <el-form-item label="文章分類" prop="cate_id">
        <ChannelSelect v-model="formModel.cate_id" width="100%"></ChannelSelect>
      </el-form-item>
      <!-- 封面 -->
      <el-form-item label="文章封面" prop="cover_img">
        <!-- 此處需要關閉element-plus的自動上傳，不需要配置action等參數 -->
        <!-- 只需要做前端的本地預覽即可，無須在提交前上傳圖片 -->
        <!-- 語法 URL.createObjectURL(...) 建立本地預覽地址，來預覽 -->
        <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false" :on-change="onSelectFile">
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <!-- 內容 -->
      <el-form-item label="文章內容" prop="content">
        <div class="editor">
          <!-- content-type="html" 設定內容格式 -->
          <!-- v-model:content="formModel.content" 雙向數據綁定 -->
          <QuillEditor ref="editorRef" v-model:content="formModel.content" content-type="html" theme="snow">
          </QuillEditor>
        </div>
      </el-form-item>
      <!-- 內文編輯 -->
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">發布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
  .avatar-uploader {
    :deep() {
      .avatar {
        width: 178px;
        height: 178px;
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
        width: 178px;
        height: 178px;
        text-align: center;
      }
    }
  }

  .editor {
    width: 100%;

    :deep(.ql-editor) {
      min-height: 200px;
    }
  }
</style>
