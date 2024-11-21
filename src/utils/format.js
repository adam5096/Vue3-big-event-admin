import { dayjs } from 'element-plus'
// 日期格式化工具  封裝成函數 以重複使用
export const formatTime = (time) => dayjs(time).format('YYYY年MM月DD日')
