<template>
  <Head>
<!--    <link href="//cdn.staticfile.org/bulma/0.8.0/css/bulma.min.css" rel="stylesheet">-->
    <link href="//at.alicdn.com/t/font_1126470_mw96cdkxh8a.css" rel="stylesheet">
  </Head>

  <NuxtLayout>
<!--    不要删除包裹NuxtPage的Div，删除可能引发router.push的错误-->
    <div class="w-[100%]">
      <NuxtPage />
    </div>
  </NuxtLayout>
  <ConsoleMessage></ConsoleMessage>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
</style>
