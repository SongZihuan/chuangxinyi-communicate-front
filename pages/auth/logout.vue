<template>
  <div></div>
</template>

<script setup lang="ts" name="loginIndex">
import { NextLoading } from '~/common/loading';
import { ElLoading } from 'element-plus'
import { useAuthStore } from '~/store/auth'
import Utils from '~/common/utils'

definePageMeta({
  layout: "base",
})

const route = useRoute()
const router = useRouter()
const runtimeConfig = useRuntimeConfig()
const authStore = useAuthStore()

// 页面加载时
onMounted(async ()=>{
  if (process.client) {
    const loadingInstance = ElLoading.service({ fullscreen: true, text: '正在处理，请稍后...' });  // 不要写正在登出，因为未必是登出
    if (document.referrer !== runtimeConfig.public.LOGOUT_REFERRER) {  // 检查referrer，防止直接访问和恶意访问
      await router.push("/404")
    } else {
      const logout = Number(route.query.logout) === 1

      if (logout) {
        await authStore.logout()
        setTimeout(async ()=> {
          await Utils.linkTo("/")
        }, 1000)
      } else {
        await Utils.linkTo("/")
      }
    }

    NextLoading.done();
    loadingInstance.close()
  }
})

</script>

<style scoped lang="scss">
</style>
