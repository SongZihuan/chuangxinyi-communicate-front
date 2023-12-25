<template>
  <div v-if="config.siteNotification" class="widget">
    <div class="widget-header">公告</div>
    <div class="widget-content content notice-content">
      <p v-html="config.siteNotification"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useConfigStore} from '~/store/config'

const configStore = useConfigStore()

let config = computed((): any => {
  return configStore.setting
})
</script>

<style lang="scss" scoped>
.notice-content {
  font-size: 80%;
}
</style>
