<template>
  <div v-if="randomSiteTip" class="widget tip">
    <div v-if="randomSiteTip.title" class="widget-header">
      {{ randomSiteTip.title }}
    </div>
    <div class="widget-content content tip-content">
      <p v-html="randomSiteTip.content"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useConfigStore} from '~/store/config'
const configStore = useConfigStore()

let randomSiteTip = computed(() => {
  const siteTips = configStore.setting.siteTips
  if (!siteTips || siteTips.length === 0) {
    return null
  }
  return siteTips[Math.floor(Math.random() * siteTips.length)]
})

</script>

<style lang="scss" scoped>
.tip {
  .content {
    font-size: 80%;
  }
}
</style>
