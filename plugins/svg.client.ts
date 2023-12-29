import SvgIcon from '@/components/SvgIcon.vue'
import 'virtual:svg-icons-register'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.component('svg-icon', SvgIcon)
})
