<script setup>
  import { ref } from 'vue' //分別匯出
  import { Edit, Delete } from '@element-plus/icons-vue' //分別匯出
  import ChannelSelect from './components/ChannelSelect.vue' //預設匯出
  import ArticleEdit from './components/ArticleEdit.vue'
  import { artGetListService } from '@/api/article.js' //分別匯出
  import { formatTime } from '@/utils/format.js' //分別匯出

  const articleList = ref([]) // 保存取回的文章列表
  const total = ref(0) // 保存取回的總文章數
  const loading = ref(false) // loading狀態

  // 定義請求參數物件 向伺服器發請求時要攜帶過去的參數格式與內容
  const params = ref({
    pagenum: 1, // 當前所在頁
    pagesize: 10, // 每頁資料筆數
    cate_id: '',
    state: ''
  })
  // 請求文章列表邏輯
  const getArticleList = async () => {
    loading.value = true
    const res = await artGetListService(params.value)
    // console.log(res)
    articleList.value = res.data.data
    total.value = res.data.total
    // console.log('articleList', articleList.value)
    // console.log('total', total.value)
    loading.value = false
  }
  // 根據params參數取得文章列表
  getArticleList()

  // 處理分頁邏輯
  const onSizeChange = (size) => {
    // console.log('當前每頁展示資料筆數', size)
    // 只要頁數變化了，原本正在閱讀的當前頁面意義不大(可能不存在，數據高機率也不再原頁)
    params.value.pagenum = 1
    params.value.cate_id = ''
    params.value.state = ''
    params.value.pagesize = size
    // 根據最新當前頁 和 每頁資料筆數 重新渲染頁面
    getArticleList()
  }
  // 處理分頁邏輯
  const onCurrentChange = (page) => {
    // console.log('頁碼變化', page)
    params.value.pagenum = page
    // 根據最新當前頁 渲染資料
    getArticleList()
  }
  // 點擊 搜尋 按鈕及後續邏輯  => 按照最新條件進行搜尋
  const onSearch = () => {
    params.value.pagenum = 1 // 先重置頁碼
    getArticleList()
  }
  // 點擊 重置 按鈕及後續邏輯 => 清空篩選條件後，重新檢索，從第1頁開始展示
  const onReset = () => {
    params.value.pagenum = 1 // 先重置頁碼
    params.value.cate_id = ''
    params.value.state = ''
    getArticleList()
  }
  // 存放原件實例 以利使用子元件articleEditRef內的open方法
  const articleEditRef = ref()
  // 點擊 新增文章 按鈕及後續邏輯 =>
  const onAddArticle = () => {
    articleEditRef.value.open({})
  }

  // 點擊編輯按鈕
  const onEditArticle = (row) => {
    // console.log('row', row)
    articleEditRef.value.open(row)
  }

  // 點擊刪除按鈕
  const onDeleteArticle = (row) => {
    console.log('row', row)
  }

  // 新增或編輯文章成功之後的回呼函數
  const onSuccess = (type) => {
    if (type === 'add') {
      // 如果是新增，建議展示最後一頁
      const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
      // 更新成最大頁碼數
      params.value.pagenum = lastPage
    }
    getArticleList()
  }
</script>

<template>
  <!-- src目錄底下第一層components 目錄中的元件會被自動註冊與匯入  -->
  <!-- 在其他元件中直接使用即可 -->
  <page-container title="文章管理">
    <template #extra>
      <!-- 這裡與影片所示範設定不同 -->
      <!-- <el-button>新增分類</el-button> -->
      <el-button type="primary" @click="onAddArticle">新增文章</el-button>
    </template>
    <!-- 表單 -->
    <el-form inline>
      <el-form-item label="文章分類:">
        <!-- 在元件標籤的inline位置使用 v-model的語意 -->
        <!-- v-on="input" 簡寫等於 @input="..."-->
        <!-- 在Vue2 => v-model:value 相當於簡寫 :value 和 @input: -->
        <!-- 在Vue3 => v-model:modelValue 相當於簡寫 :modelValue 和 @update:modelValue -->
        <!-- 類推 => v-model:cid 相當於簡寫 :cid 和 @update:cid -->
        <ChannelSelect v-model="params.cate_id" style="width: 250px"></ChannelSelect>
      </el-form-item>
      <el-form-item label="發布狀態:">
        <!-- 本專案所用後台標記發布狀態，就是通過中文標記，已發布/草稿 -->
        <el-select v-model="params.state" style="width: 250px">
          <!-- 為配合api規格，value值用簡體書寫 已发布 -->
          <el-option label="已發布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜尋</el-button>
        <el-button @click="onReset" type="warning">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章標題" prop="title">
        <!-- prop 僅單純取值、填值 -->
        <!-- 作用域插槽可填充自訂結構 + 值-->
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="文章分類" prop="cate_name"></el-table-column>
      <el-table-column label="發表時間" prop="pub_date">
        <!-- table-column預設prop屬性值 -->
        <!-- 如出現template結構，會自動忽略prop屬性值，改優先呈現template內定義的數據 -->
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="狀態" prop="state"></el-table-column>
      <el-table-column label="動作">
        <!-- 使用作用域插槽 row 可以取得當前橫列的數據 => 理解 row 相當於v-for 的每一項item-->
        <template #default="{ row }">
          <el-button circle plain type="primary" :icon="Edit" @click="onEditArticle(row)"></el-button>
          <el-button circle plain type="danger" :icon="Delete" @click="onDeleteArticle(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分頁器 -->
    <el-pagination v-model:current-page="params.pagenum" v-model:page-size="params.pagesize"
      :page-sizes="[2, 5, 10, 15]" :size="size" :background="true" layout="jumper, total, sizes, prev, pager, next"
      :total="total" @size-change="onSizeChange" @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end" />
    <!-- 新增文章後展示抽屜原件 -->
    <!-- @success 像是話筒，時刻聽著來自子組件的喊話 -->
    <!-- 聽見喊話後，轉往本地 onSuccess 執行後續邏輯 -->
    <ArticleEdit ref="articleEditRef" @success="onSuccess"></ArticleEdit>
  </page-container>
</template>

<style lang="scss" scoped></style>
