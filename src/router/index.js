import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

// createRouter 建立路由實例
// 設置history 路由模式
// 1. history createWebHistory 網址欄 不出現 #
// 2. hash    createWebHashHistory 網址欄 出現 #

// vite 中的環境變數 import.meta.env.BASE_URL 即vite.config.js 中的base設置
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // 登入頁
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/channel',
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})
// 登入訪問攔截 路由守衛 => 新版本語法預設直接放行
// 根據返回值決定放行或攔截
// 返回值
// 1. undefined true 直接放行
// 2. false 攔住後回到from的地址頁面
// 3. 具體路徑或路徑物件 攔截並跳轉到對應地址頁面
//  '/login' {name: 'login'}
router.beforeEach((to) => {
  // 如果沒有token, 且訪問非登入頁(需授權), 攔截並回到登入, 其他情況正常放行
  const userStore = useUserStore()
  // !userStore.token  沒有token
  // to.path !== '/login'  訪問非登入頁
  if (!userStore.token && to.path !== '/login') return '/login'

  return true //其他情況正常放行
})
export default router
