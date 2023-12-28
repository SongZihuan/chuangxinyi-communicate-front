<template>
  <div class="my-2">
    <el-card>
      <template #header>
        <div>
          公告
        </div>
      </template>
      <div>
        <div v-html="config.siteNotification"></div>
      </div>
    </el-card>
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
