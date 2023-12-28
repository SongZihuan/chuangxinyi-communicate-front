<template>
  <div v-if="randomSiteTip" class="my-2">
    <el-card>
      <template #header>
        <div>
          {{ randomSiteTip.title }}
        </div>
      </template>
      <div>
        <div v-html="randomSiteTip.content"></div>
      </div>
    </el-card>
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
