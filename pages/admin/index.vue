<template>
  <div class="flex flex-col my-2">
    <el-card class="my-2">
      <template #header>
        <div>构建信息</div>
      </template>

      <div>
        <div>APP名称: {{ systeminfo.appName }}</div>
      </div>
    </el-card>
    <el-card class="my-2">
      <template #header>
        <div>运行时信息</div>
      </template>

      <div>
        <div>运行时间: {{ systeminfo.upTime }}</div>
        <div>系统: {{ systeminfo.os }}</div>
        <div>架构: {{ systeminfo.arch }}</div>
        <div>CPU: {{ systeminfo.numCpu }}</div>
        <div>Go版本: {{ systeminfo.goversion }}</div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useAdminApi } from '~/api/admin'
import Utils from "~/common/utils"

definePageMeta({
  layout: "admin",
  middleware: [
    'authenticated',
  ],
})

useHead({
  title: Utils.siteTitle("管理员")
})

let systeminfo = ref({})

const getSystemInfo = async () => {
  let {data, status, error} = await useAdminApi().getSystemInfo()
  if (status.value === "success" && data.value.success) {
    systeminfo.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
  setTimeout(async () => {
    await getSystemInfo()
  }, 1000)
}

await Promise.all([
  getSystemInfo(),
])

</script>

<style lang="scss" scoped>
</style>
