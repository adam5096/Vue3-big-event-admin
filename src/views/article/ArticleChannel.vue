<script setup>
import { ref, markRaw } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { artGetChannelsService, artDelChannelsService } from '@/api/article.js'
import ChannelEdit from './components/ChannelEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// 通過向server發送請求後取得回傳資料 用以展示
// 本教材提供之api '/my/cate/list' 僅限付費會員 或 境內ip?使用，已測試過表格內容無法取回
// 改以本地既有數據展示

// 改以 登入後 跳轉至 文章分類元件的第一時間
// 先新增數據後再行渲染，否則元畫面會空白一片
const channelList = ref([])
// 如請求失敗 或回傳失敗 改以展示本地既有數據
// const channelListOriginal = ref([
//   {
//     id: 44133,
//     cate_name: '新聞',
//     cate_alias: 'news'
//   },
//   {
//     id: 44157,
//     cate_name: '熱點',
//     cate_alias: 'hot'
//   },
//   {
//     id: 44160,
//     cate_name: '工程師',
//     cate_alias: 'worker'
//   },
//   {
//     id: 44171,
//     cate_name: '姐姐',
//     cate_alias: 'girl'
//   },
//   {
//     id: 44173,
//     cate_name: '哥哥',
//     cate_alias: 'boy'
//   },
//   {
//     id: 44174,
//     cate_name: '社會',
//     cate_alias: 'social'
//   },
//   {
//     id: 45007,
//     cate_name: '體育',
//     cate_alias: 'sports'
//   }
// ])

// 在server將數據送回瀏覽器的路上 展示載入動畫 改善使用者體驗
const loading = ref(false)
// 存取元件channel-edit的實例
const dialog = ref()

const getChannelList = async () => {
  // 發送一開始就展示 載入動畫
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  console.log('channelList', channelList.value)
  // 取回資料並存進本地容器後就取消動畫，展示取回的數據
  loading.value = false
}
// 在呼叫就等同於在setup週期(鉤子)呼叫，也可以在onMounted週期(鉤子)呼叫
getChannelList()
// 點擊 刪除 按鈕後
const onDelChannel = async (row) => {
  // console.log('row, $index', row, $index)
  await ElMessageBox.confirm('確認要刪除嗎', '溫馨提醒', {
    type: 'warning',
    icon: markRaw(Delete),
    confirmButtonText: '確認刪除',
    cancelButtonText: '留住'
  })
  // 發起 刪除請求
  await artDelChannelsService(row.id)
  ElMessage.success('刪除成功')
  getChannelList()
}
// 點擊 編輯 按鈕後
const onEditChannel = (row) => {
  // console.log('row', row)
  // 拿到子元件實例dialog裡面的open方法，並傳值
  dialog.value.open(row)
}
// 點擊 新增文章 按鈕後
const onAddChannel = (e) => {
  console.log('e', e)
  // 拿到子元件實例dialog裡面的open方法，並傳值
  dialog.value.open({})
}
// 監聽子元件自訂事件success 後的 callback函數onSuccess 做出應對行為
const onSuccess = () => {
  // 關閉彈出式對話窗後
  // 再次渲染 新增操作 或 編輯操作 之後的畫面
  getChannelList()
}
</script>
<template>
  <!-- components 目錄中的元件會被自動註冊與匯入  -->
  <page-container title="文章分類">
    <template #extra>
      <!-- 這裡與影片所示範設定不同 -->
      <!-- <el-button>新增分類</el-button> -->
      <el-button type="primary" @click="onAddChannel">新增分類</el-button>
    </template>
    <!-- table 中展示既有數據 -->
    <!-- :data="channelListOriginal" 要展示的數據來源-->
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序號" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="分類名稱"></el-table-column>
      <el-table-column prop="cate_alias" label="分類別名"></el-table-column>
      <el-table-column label="動作" width="150">
        <!-- row 相當 channelList 的一項 ; $index 下標-->
        <!-- table中自定義內容 -->
        <template #default="{ row, $index }">
          <!-- 編輯按鈕 -->
          <el-button
            :icon="Edit"
            circle
            plain
            type="warning"
            @click="onEditChannel(row, $index)"
          ></el-button>
          <!-- 刪除按鈕 -->
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row, $index)"
          ></el-button>
        </template>
      </el-table-column>
      <!-- 空狀態插槽： 如沒有數據 自動展示這個內容-->
      <template>
        <el-empty description="沒有數據" />
      </template>
    </el-table>
    <!-- 彈出對話視窗 -->
    <!-- @success 監聽來自子元件的事件success  -->
    <!-- 一觸發success 立刻執行父元件本地的回呼函數onSuccess -->
    <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
  </page-container>
</template>

<style lang="scss" scoped></style>
