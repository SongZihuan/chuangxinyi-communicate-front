<template>
  <div class="flex flex-col">
    <TopicList ref="topicList"  :topics="topicsPage.results"/>
    <Pagination @change="onChange" :page="topicsPage.page"/>
  </div>
</template>

<script setup lang="ts">

import { useTopicApi } from '~/api/topics'
import Pagination from '~/components/Pagination.vue'
import TopicList from '~/components/TopicList.vue'

let topicsPage = ref({})

const props = defineProps({
  page: {
    type: Number,
    default: 1,
  }
})

let page = ref(props.page)
let topicList = shallowRef()

const getTopics = async () => {
  let {data, status, error} = await useTopicApi().topicsRecommend(page.value)
  if (status.value === "success" && data.value.success) {
    topicsPage.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
    showError({
      statusCode: 404,
      message: "话题未找到",
    })
  }
}

const onChange = async (newPage: number) => {
  page.value = newPage
  await getTopics()
  topicList.value.setTopicList(topicsPage.value.results as any)
}

await Promise.all([
  getTopics(),
])

</script>

<style scoped lang="scss">

</style>
