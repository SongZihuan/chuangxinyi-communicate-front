<template>
  <div class="page-container">
    <h1 class="index-title">控制台</h1>
    <div class="widget">
      <div class="widget-header">构建信息</div>
      <div class="widget-content">
        <div>App name: {{ systeminfo.appName }}</div>
      </div>
    </div>
    <div class="widget">
      <div class="widget-header">运行信息</div>
      <div class="widget-content">
        <div>Runtime: {{ systeminfo.upTime }}</div>
        <div>OS: {{ systeminfo.os }}</div>
        <div>Arch: {{ systeminfo.arch }}</div>
        <div>CPU: {{ systeminfo.numCpu }}</div>
        <div>Go version: {{ systeminfo.goversion }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminApi } from '~/api/admin'

definePageMeta({
  layout: "admin",
  middleware: [
    'authenticated',
  ],
})

let systeminfo = ref({})

const getSystemInfo = async () => {
  let {data, status, error} = await useAdminApi().getSystemInfo()
  if (status.value === "success" && data.value.success) {
    systeminfo.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

await Promise.all([
  getSystemInfo(),
])

</script>

<style lang="scss" scoped></style>
