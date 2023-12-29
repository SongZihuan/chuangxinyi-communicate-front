<template>
  <div class="flex flex-col">
    <ArticleList :articles="articlesPage"/>

    <div class="flex flex-col items-end">
      <el-button @click="Utils.linkTo('/user/' + userId + '/articles/1')">查看更多</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserApi } from '~/api/user'
import Utils from '~/common/utils'

let articlesPage = ref({})

const props = defineProps({
  userId: {
    type: Number,
    require: true
  }
})

let userId = ref(props.userId)

const getTopics = async () => {
  console.log(props.userId)
  let {data, status, error} = await useUserApi().articleRecent(userId.value)
  if (status.value === "success" && data.value.success) {
    articlesPage.value = data.value.data
    console.log("SUCCESS", articlesPage.value)
  } else {
    console.log(status.value, error && error.value, data.value)
    console.log("FAIL")
  }
}

await Promise.all([
  getTopics(),
])

</script>

<style scoped lang="scss">

</style>
