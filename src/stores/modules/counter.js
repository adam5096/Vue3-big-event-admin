import { defineStore } from 'pinia'
import { ref } from 'vue'
// 計數器 模組
export const useCountStore = defineStore('big-count', () => {
  const count = ref(100)
  const add = (n) => {
    count.value += n
  }
  return {
    count,
    add
  }
})
