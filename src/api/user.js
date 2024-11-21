import request from '@/utils/request.js'
// 註冊接口
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/api/reg', { username, password, repassword })

// 登入接口
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })

// 取得使用者基本訊息
export const userGetInfoService = () => request.get('/my/userinfo')

// 修改使用者訊息
// 將參數解構，看得更清楚
export const userUpdateInfoService = ({ id, nickname, email }) =>
  request.put('/my/userinfo', { id, nickname, email })

// 修改使用者頭像
export const userUpdateAvatarService = (avatar) =>
  request.patch('/my/update/avatar', { avatar })

// 修改使用者密碼
export const userUpdatePasswordService = ({ old_pwd, new_pwd, re_pwd }) => {
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
}
