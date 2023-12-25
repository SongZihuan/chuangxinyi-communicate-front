import VueLazyLoad from 'vue3-lazyload'

export default defineNuxtPlugin(async ({ vueApp }) => {
  vueApp.use(VueLazyLoad)
})
