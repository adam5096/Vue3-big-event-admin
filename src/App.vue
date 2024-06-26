<script setup>
import zhTw from 'element-plus/dist/locale/zh-tw.mjs'
</script>

<template>
  <div>
    <!-- 設置語言包，中英國際化處理 -->
    <el-config-provider :locale="zhTw">
      <!-- app.vue只需留下一個路由出口 -->
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>
