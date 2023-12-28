<template>
  <div v-if="scoreRank" class="my-2">
    <el-card>
      <template #header>
        <div>
          积分排行榜
        </div>
      </template>
        <ScoreRankItem
          v-for="(user, index) in scoreRank"
          :key="index"
          :user="user"
        />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useUserApi } from '~/api/user'

const scoreRank = ref([])

const getUserScoreRand = async () => {
  let {data, status, error} = await useUserApi().scoreRank()
  if (status.value === "success" && data.value.success) {
    scoreRank.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

await Promise.all([
  getUserScoreRand(),
])

</script>


<style scoped lang="scss">

</style>
