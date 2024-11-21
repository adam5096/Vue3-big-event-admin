<script setup>
import { artGetChannelsService } from '@/api/article.js'
import { ref } from 'vue'
// 註冊接收父元件傳子元件的傳遞參數
defineProps({
  modelValue: {
    type: [Number, String] // 多型別
  },
  width: {
    type: String
  }
})
// 把父元件監聽的事件update:modelValue與子元件自定義事件綁定
const emit = defineEmits(['update:modelValue'])
const channelList = ref([])
// 取得文章列表邏輯
const getChannelList = async () => {
  // 發請求取回文章列表數據
  const res = await artGetChannelsService()
  // 取回數據後保存起來(存到channelList這裡)
  channelList.value = res.data.data
  // 展示 確認數據有抵達瀏覽器
  // console.log('channelList', channelList.value)
}
getChannelList()
</script>

<template>
  <!-- 監聽update事件，一但下拉選單發生使用者重新選擇項目，子元件就向上(父元件)傳遞參數$event -->
  <!-- $event 攜帶每個單獨選項的相關參數 -->
  <el-select :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)" :style="{ width }">
    <!-- label 展示給使用者看 -->
    <!-- value 真正提交給伺服器的內容 -->
    <!-- v-for 渲染各下拉選項 -->
    <el-option v-for="channel in channelList" :key="channel.id" :label="channel.cate_name"
      :value="channel.id"></el-option>
  </el-select>
</template>

<style scoped></style>
