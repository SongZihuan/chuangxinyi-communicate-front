<template>
  <div class="flex flex-row justify-between">
    <div class="w-[75%]">
      <div class="flex flex-col">
        <div class="mb-2">
          <div class="title">
            <span class="node-title"> {{ node.name }} </span>
            <el-tag class="mx-2">
              共有 {{ node.topicCount }} 个讨论话题
            </el-tag>
          </div>
          <div class="summary">
            <p>{{ node.description }}</p>
          </div>
        </div>

        <TopicList ref="topicList" :topics="topicsPage.results"/>
        <Pagination @change="onChange" :page="topicsPage.page" url-prefix="/topics?p=" />
      </div>
    </div>
    <TopicSide class="w-[25%]" :currentNodeId="node.nodeId"/>
  </div>
</template>

<script setup lang="ts">
import TopicSide from '~/components/TopicSide'
import TopicList from '~/components/TopicList'
import Pagination from '~/components/Pagination'
import { useTopicApi } from '~/api/topics'
import Utils from "~/common/utils"

let node = ref({})
let topicsPage = ref({})

const topicList = shallowRef()
const route = useRoute()
const page = route.query.p || 1
const nodeId = route.params.nodeId

const getNode = async () => {
  let {data, status, error} = await useTopicApi().getNode(nodeId)
  if (status.value === "success" && data.value.success) {
    node.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
    showError({
      statusCode: 404,
      message: "节点未找到",
    })
  }
}

const getTopics = async () => {
  let {data, status, error} = await useTopicApi().topicsNode(page.value, nodeId)
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
  getNode(),
  getTopics(),
])

useHead({
  title: Utils.siteTitle(node.value.name + ' - 话题'),
  meta: [
    {
      name: 'description',
      content: Utils.siteDescription()
    },
    { name: 'keywords', content: Utils.siteKeywords() }
  ]
})
</script>

<style lang="scss" scoped>
.node-title{
  font-size: 30px;
}
</style>
