<template>
  <div class="flex flex-col">
    <TopicList :topics="topicsPage"/>
    <div class="flex flex-col items-end">
      <el-button @click="Utils.linkTo('/user/' + userId + '/topics/1')">查看更多</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopicList from '~/components/TopicList.vue'
import { useUserApi } from '~/api/user'
import Utils from "~/common/utils"

let topicsPage = ref({})

const props = defineProps({
  userId: {
    type: Number,
    require: true
  }
})

let userId = ref(props.userId)
console.log("AAC", userId.value)

const getTopics = async () => {
  console.log(props.userId)
  let {data, status, error} = await useUserApi().topicesRecent(userId.value)
  if (status.value === "success" && data.value.success) {
    topicsPage.value = data.value.data
  } else {
    console.log(status.value, error && error.value, data.value)
  }
}

await Promise.all([
  getTopics(),
])

</script>

<style scoped lang="scss">

</style>
