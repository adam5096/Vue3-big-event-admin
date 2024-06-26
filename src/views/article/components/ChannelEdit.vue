<script setup>
import { ref } from 'vue'
import { artAddChannelsService, artEditChannelsService } from '@/api/article'
import { ElMessage } from 'element-plus'
const dialogVisible = ref(false)
const formRef = ref()
// 準備容器承接資料 提供el-form :model="formModel" 展示數據
// 以及與兩個input元素做v-model雙向綁定
const formModel = ref({
  id: '',
  cate_name: '',
  cate_alias: ''
})
// const formModel = reactive({
//   cate_name: '',
//   cate_alias: ''
// })

// 校驗規則集
const rules = {
  cate_name: [
    {
      required: true,
      message: '請輸入分類名稱',
      trigger: 'blur'
    },
    {
      pattern: /^\S{1,10}$/, //任意10位字元(英文大、小寫，中文，特殊符號) + 非空
      message: '分類名稱必須是 1~10位 的非空字元',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    {
      required: true,
      message: '請輸入分類別名',
      trigger: 'blur'
    },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/, // 英文字母或數字 共1~15位元
      message: '分類別名必須是 1~15位 的非空字元',
      trigger: 'blur'
    }
  ]
}
// 註冊/定義事件 通知父元件ArticleChannel
const emit = defineEmits(['success'])
// 彈出對話窗 點擊確定按鈕後
const onSubmit = async () => {
  // 先做表單預校驗
  await formRef.value.validate()
  // 讀取id值作為判斷 新增操作 或 編輯操作 的依據
  const isEdit = formModel.value.id
  if (isEdit) {
    await artEditChannelsService(formModel.value)
    ElMessage.success('編輯成功')
  } else {
    await artAddChannelsService(formModel.value)
    ElMessage.success('新增成功')
  }
  // 關閉彈出對話窗
  dialogVisible.value = false
  // 發起通知 通知父元件ArticleChannel 再次發請求渲染文章分類頁面
  emit('success')
}

// 因為在 新增文章 與 編輯文章 都共用到彈出對話框功能 故封裝成一個元件以利複用
// 對外匯出一個方法open， 根據open傳過來的參數， 區分是 新增 或 編輯
// open({}) => 無須重新渲染表單，說明是 新增操作
// open({id, cate_name, ... }) => 要重新渲染表單，說明是 編輯操作
// 呼叫open後，可以打開對話窗(互動窗)
// Object
// Proxy(Object)

const open = (row) => {
  // console.log(formModel.value.cate_alias)
  // console.log(formModel.value.cate_name)
  // console.log(row.cate_name) => undefined
  // console.log(row.cate_alias) => undefined
  console.log('row', row)
  // console.log('row.row', row.row)

  //ES6 物件展開追加語法 row物件會成為formModel物件的新key-value，從物件尾部加入
  // 新增=>重製表單內容，編輯=>儲存需要回頭展示的數據
  dialogVisible.value = true
  // formModel.value = { ...row.row }
  formModel.value = { ...row }

  //ES6 合併物件語法 舊物件與新物件的key-value合併成為全新物件
  // Object.assign(formModel.value, row)

  console.log(formModel.value)
}

// 對外匯出元件內部方法 供父件取用
defineExpose({
  open
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '編輯分類' : '新增分類'"
    width="30%"
  >
    <!-- 彈窗結構 上層 -->
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="分類名稱" prop="cate_name">
        <el-input
          v-model="formModel.cate_name"
          placeholder="請輸入分類名稱"
        ></el-input>
      </el-form-item>
      <el-form-item label="分類別名" prop="cate_alias">
        <el-input
          v-model="formModel.cate_alias"
          placeholder="請輸入分類別名"
        ></el-input>
      </el-form-item>
    </el-form>

    <!-- 彈窗結構 下層 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 確認 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
