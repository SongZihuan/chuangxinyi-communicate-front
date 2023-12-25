import VueLazyload from 'vue-lazyload'

export default defineNuxtPlugin(async ({ vueApp }) => {
  vueApp.use(VueLazyload)
})
