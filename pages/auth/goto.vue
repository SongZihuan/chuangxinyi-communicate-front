<script setup lang="ts">
  import Utils from '~/common/utils'

  definePageMeta({
    layout: "base",
  })

  await Utils.toSignin()
</script>

<template>
  <div></div>
</template>

<style scoped lang="scss">

</style>
