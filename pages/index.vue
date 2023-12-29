<template>
  <div class="flex flex-row justify-between">
    <Topics class="w-[75%]" />
    <TopicSide class="w-[25%]"/>
  </div>
</template>

<script setup lang="ts">
import Utils from "~/common/utils"

definePageMeta({
  layout: "all"
})

useHead({
  title: Utils.siteTitle("社区"),
  meta: [
    {
      name: 'description',
      content: Utils.siteDescription(),
    },
    { name: 'keywords', content: Utils.siteKeywords() },
  ],
})

</script>

<style lang="scss" scoped></style>
