<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  CaretBottom,
  SwitchButton
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()
// 如果沒寫在onMounted鉤子內，那預設會在setup生命週期階段執行，兩者擇一即可
// 額外練習鉤子函數
onMounted(() => {
  // 從倉庫模組中 取出當前登入者資訊 用以展示到頁面
  userStore.getUser()
})
// 退出平台邏輯
// key 可以拿到 command屬性的值 logout字串
// <el-dropdown-item command="logout" :icon="SwitchButton">
const handleCommand = async (key) => {
  if (key === 'logout') {
    // 退出操作
    // 因為ElMessageBox會回傳promise物件，故搭配async await 使用
    await ElMessageBox.confirm('確認要進行退出?', '溫馨提示', {
      type: 'warning',
      confirmButtonText: '確認退出',
      cancelButtonText: '留在平台繼續作業'
    })

    // 清除本地數據 token user訊息
    userStore.removeToken()
    // 傳入空物件 {} 將倉庫模組內對應容器清空
    userStore.removeUser({})
    // 跳轉 登入頁
    router.push('/login')
  } else {
    // 跳轉操作 到指定下拉項的對應頁面
    router.push(`/user/${key}`)
  }
}
</script>

<template>
  <!-- 左側
     el-menu 整個選單元件
     :default-active="$route.path" 設置預設高亮效果的選單項目
     route router選項開啟, el-menu-item的index就是點擊跳轉路徑

     el-menu-item 選單項(域)
     index="/article/channel" 設置訪問的跳轉路徑 配合:default-active值實現高亮
    -->
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <!-- 一級選單 -->
        <el-menu-item index="/article/channel">
          <el-icon><Management /></el-icon>
          <span>文章分類</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>文章管理</span>
        </el-menu-item>

        <!-- 二級選單 -->
        <el-sub-menu index="/user">
          <!-- 多級選單標題 - 具名插槽 title -->
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>個人中心</span>
          </template>

          <!-- 展開的內容 預設插槽 -->
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>基本資料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>更換頭像</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>重置密碼</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <!-- 右側 -->
    <el-container>
      <el-header>
        <div>
          黑馬網頁前端:
          <strong>{{
            userStore.user.nickname || userStore.user.username
          }}</strong>
        </div>
        <!-- @command="handleCommand" 在下拉單項中 監聽點擊事件 -->
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <!-- 展示給當前登入者 -->
          <span class="el-dropdown__box">
            <el-avatar :src="userStore.user.user_pic || avatar"></el-avatar>
            <el-icon><CaretBottom /></el-icon>
          </span>
          <!-- 折疊的下拉部分 -->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User"
                >基本資料
              </el-dropdown-item>
              <el-dropdown-item command="avatar" :icon="Crop"
                >更換頭像
              </el-dropdown-item>
              <el-dropdown-item command="password" :icon="EditPen"
                >重置密碼
              </el-dropdown-item>
              <el-dropdown-item command="logout" :icon="SwitchButton"
                >退出登入
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!-- 主內容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer> 大事件 @2023 Ccreated by 黑馬網頁前端 </el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #232323;
    .el-menu {
      border-right: none;
    }
  }
  .el-aside__logo {
    height: 120px;
    background: url('@/assets/logo.png') no-repeat center/120px auto;
  }
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }
    }
    .el-dropdown__box:active,
    .el-dropdown__box:focus {
      outline: none;
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
