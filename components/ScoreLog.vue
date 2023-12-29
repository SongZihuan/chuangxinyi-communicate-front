<template>
  <el-card>
    <el-text class="mr-2">
      {{ scoreLog.type === 0 ? '获得' : '减少' }}
      {{ scoreLog.score }}积分
    </el-text>

    <el-text class="mx-2">
      原因：{{ scoreLog.description }}
    </el-text>

    <el-text class="ml-2">
      时间：{{ Utils.formatDate(scoreLog.createTime) }}
    </el-text>
  </el-card>
</template>

<script setup lang="ts">

import Utils from '~/common/utils'

const props = defineProps({
  scoreLog: {
    type: Object,
    require: true,
  }
})

let scoreLog = ref(props.scoreLog)

</script>

<style lang="scss" scoped></style>
