<script setup lang="ts">
  import Utils from '~/common/utils'

  definePageMeta({
    layout: "base",
  })

  await Utils.toSignin(useNuxtApp())
</script>

<template>
  <div></div>
</template>

<style scoped lang="scss">

</style>
