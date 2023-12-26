<template>
  <div></div>
</template>

<script setup lang="ts">
import { NextLoading } from '~/common/loading';
import utils from '~/common/utils'
import {ElMessage} from "element-plus"
import {useAuthStore} from '~/store/auth'

definePageMeta({
  layout: "base",
})

const route = useRoute()

if (process.client) {
  NextLoading.start()
  let redirect = route.query?.redirect
  if (!redirect) {
    redirect = "/"
  }

  let loginToken = route.query?.token
  let subToken = route.query?.subToken
  let hasRoute = ref(false)  // 确保必须路由到一个页面

  if (loginToken && subToken) {
    try {
      await useAuthStore().login({
        token: loginToken
      }, useNuxtApp())
      utils.linkTo(redirect)
      hasRoute.value = true
    } catch (e) {
      ElMessage.error(e.message || e)
    }
  }

  if (!hasRoute.value) {
    setTimeout(()=>{
      utils.linkTo("/")
    }, 1000)
  }

  NextLoading.done();
}

</script>

<style scoped lang="scss">

</style>
