<script setup>
// 接收父件傳值title
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <!-- 元件外側傳入訂製標題 -->
        <span>{{ title }}</span>
        <div class="extra">
          <!-- 元件外側傳入具名插槽訂製按鈕 -->
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <!-- 元件外側傳入預設插槽訂製內容 -->
    <slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
