<template>
  <div class="my-2">
    <el-card>
      <template #header>
        <div>
         站点统计
        </div>
      </template>
      <div class="">
          <el-row>
            <el-col :span="8">
              <el-statistic title="主题数" :value="stat.topicCount" />
            </el-col>
            <el-col :span="8">
              <el-statistic title="回帖数" :value="stat.commentCount" />
            </el-col>
            <el-col :span="8">
              <el-statistic title="用户数" :value="stat.userCount" />
            </el-col>
          </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useStatApi } from '~/api/stat'

const stat = ref({})

const getStat = async () => {
  let {data, status, error} = await useStatApi().stat()
  if (status.value === "success" && data.value.success) {
    stat.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

await Promise.all([
  getStat(),
])
</script>

<style lang="scss" scoped>
.el-col {
  text-align: center;
}
</style>
