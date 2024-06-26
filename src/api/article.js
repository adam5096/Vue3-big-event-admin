import request from '@/utils/request'
// 分類: 取得並渲染文章分類
export const artGetChannelsService = () => request.get('/my/cate/list')
// 分類: 新增文章分類
export const artAddChannelsService = (data) =>
  request.post('/my/cate/add', data)
// 分類: 編輯文章分類
export const artEditChannelsService = (data) =>
  request.put('/my/cate/info', data)
// 分類: 刪除文章分類
export const artDelChannelsService = (id) =>
  request.delete('/my/cate/del', {
    params: { id }
  })

// 文章： 取得文章列表
export const artGetListService = (params) =>
  request.get('/my/article/list', {
    params
  })

// 文章: 新增文章
// 注意：data需要是一個formData格式的物件
export const artPublishService = (data) => request.post('/my/article/add', data)

// 文章 ： 取得文章詳情 回顯
export const artGetDetailService = (id) =>
  request.get('/my/article/info', {
    params: { id }
  })

// 文章 : 編輯文章
export const artEditService = (data) => request.put('/my/article/info', data)
