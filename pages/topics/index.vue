<template>
  <div></div>
</template>

<script setup lang="ts">
import Utils from "~/common/utils"
const route = useRoute()
await Utils.linkTo("/", route.query)
</script>

<style lang="scss" scoped></style>
