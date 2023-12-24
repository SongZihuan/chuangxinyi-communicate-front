<template>
  <div></div>
</template>

<script>
import { NextLoading } from '~/common/loading';
import utils from '~/common/utils'

export default {
  async mounted() {
    let redirect = this.$route.query?.redirect
    if (!redirect) {
      redirect = "/"
    }

    let loginToken = this.$route.query?.token
    let subToken = this.$route.query?.subToken
    let hasRoute = false  // 确保必须路由到一个页面

    if (loginToken && subToken) {
      try {
        await this.$store.dispatch('auth/signin', {
          token: loginToken
        })
        utils.linkTo(redirect)
      } catch (e) {
        this.$toast.error(e.message || e)
      }
    }

    if (!hasRoute) {
      utils.linkTo("/")
    }

    NextLoading.done();
  }
}

</script>

<style scoped lang="scss">

</style>
