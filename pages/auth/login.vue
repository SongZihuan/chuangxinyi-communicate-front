<template>
  <div></div>
</template>

<script setup lang="ts">
import { NextLoading } from '~/common/loading';
import Utils from '~/common/utils'
import {useAuthStore} from '~/store/auth'

definePageMeta({
  layout: "base",
})

const route = useRoute()
const nuxtApp = useNuxtApp()

onMounted(async ()=>{
  if (process.client) {
    const loadingInstance = ElLoading.service({ fullscreen: true, text: '正在登入，请稍后...' });

    let redirect = route.query?.redirect as string
    if (!redirect) {
      redirect = "/"
    }

    let loginToken = route.query?.token
    let subToken = route.query?.subToken
    let hasRoute = ref(false)  // 确保必须路由到一个页面

    if (loginToken && subToken) {
      // try {
      await useAuthStore().login({
        token: loginToken,
        subToken: subToken,
      }, nuxtApp)
      Utils.linkTo(redirect)
      hasRoute.value = true
      // } catch (e) {
      //   console.log("ERROR", e)
      //   ElMessage.error(e.message || e)
      // }
    }

    if (!hasRoute.value) {
      setTimeout(()=>{
        Utils.linkTo("/")
      }, 1000)
    }

    NextLoading.done();
    loadingInstance.close()
  }
})

</script>

<style scoped lang="scss">

</style>
