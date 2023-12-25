import infiniteScroll from 'vue3-infinite-scroll-better'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(infiniteScroll)
})

