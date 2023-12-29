<template>
  <div class="flex flex-row justify-between">
    <div class="w-[75%]">
      <div class="flex flex-col">
        <div class="mb-2">
          <span class="tag-title"> 标签：{{ tag.tagName }}</span>
        </div>

        <TopicList ref="topicListRef" :topics="topicsPage.results"/>
        <Pagination @change="onChange" :page="topicsPage.page"/>
      </div>
    </div>
    <TopicSide class="w-[25%]" :current-tag="tag.tagName"/>
  </div>
</template>

<script setup lang="ts">
import TopicSide from '~/components/TopicSide'
import TopicList from '~/components/TopicList'
import Pagination from '~/components/Pagination'
import { useTopicApi } from '~/api/topics'
import Utils from "~/common/utils"

let tag = ref({})
let topicsPage = ref({})

const route = useRoute()
const page = route.query.p || 1
const tagId = route.params.tagId
let topicListRef = shallowRef()

const getTag = async () => {
  let {data, status, error} = await useTopicApi().tag(tagId)
  if (status.value === "success" && data.value.success) {
    tag.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
    showError({
      statusCode: 404,
      message: "标签未找到",
    })
  }
}

const getTopics = async () => {
  let {data, status, error} = await useTopicApi().topicsTag(page, tagId)
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

await Promise.all([
  getTag(),
  getTopics(),
])

const onChange = async (newPage: number) => {
  page.value = newPage
  await getTopics()
  topicListRef.value.setTopicList(topicsPage.value.results as any)
}

useHead({
  title: Utils.siteTitle(tag.value.tagName + ' - 话题'),
  meta: [
    {
      name: 'description',
      content: Utils.siteDescription()
    },
    {  name: 'keywords', content: Utils.siteKeywords() }
  ]
})
</script>

<style lang="scss" scoped>
.tag-title {
  font-size: 30px;
}
</style>
