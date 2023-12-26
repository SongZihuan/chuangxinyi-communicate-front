<template>
  <div>
    <section class="main">
      <div class="container main-container left-main">
        <div class="left-container">
          <div class="main-content">
            <div class="node-header">
              <div class="title">
                {{ node.name }}
                <span class="total">
                  共有 {{ node.topicCount }} 个讨论话题
                </span>
              </div>
              <div class="summary">
                <p>{{ node.description }}</p>
              </div>
            </div>
            <topic-list :topics="topicsPage.results" :in-home="false" />
            <pagination
              :page="topicsPage.page"
              :url-prefix="'/topics/' + node.nodeId + '?p='"
            />
            <div v-if="!topicsPage.page.total" class="summary">
              本节点暂无话题。
            </div>
          </div>
        </div>
        <topic-side
          :current-node-id="node.nodeId"
          :score-rank="scoreRank"
          :links="links"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import TopicSide from '~/components/TopicSide'
import TopicList from '~/components/TopicList'
import Pagination from '~/components/Pagination'
import { useTopicApi } from '~/api/topics'
import { useUserApi } from '~/api/user'
import { useLinksApi } from '~/api/links'
import Utils from "~/common/utils"

let node = ref({})
let topicsPage = ref({})
let links = ref({})
let scoreRank = ref({})

const route = useRoute()
const page = route.query.p || 1
const nodeId = route.params.nodeId

const getNode = async () => {
  let {data, status, error} = await useTopicApi().getNode(nodeId)
  if (status.value === "success") {
    node.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

const getTopics = async () => {
  let {data, status, error} = await useTopicApi().topicsNode(page, nodeId)
  if (status.value === "success") {
    topicsPage.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

const getScoreRank = async () => {
  let {data, status, error} = await useUserApi().scoreRank()
  if (status.value === "success") {
    scoreRank.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

const getLinks = async () => {
  let {data, status, error} = await useLinksApi().topLinks()
  if (status.value === "success") {
    links.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

await Promise.all([
  getNode(),
  getTopics(),
  getScoreRank(),
  getLinks(),
])

useHead({
  title: Utils.siteTitle(node.value.name + ' - 话题'),
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: Utils.siteDescription()
    },
    { hid: 'keywords', name: 'keywords', content: Utils.siteKeywords() }
  ]
})
</script>

<style lang="scss" scoped>
.node-header {
  margin-bottom: 5px;
  border-bottom: 1px solid #f2f2f2;
  padding: 5px 10px;

  .container {
    padding: 15px 20px;
  }
  .title {
    font-size: 24px;
    color: #333;
    margin-bottom: 8px;
    .total {
      color: #999;
      font-size: 14px;
      margin-left: 10px;
    }
  }
  .summary {
    font-size: 14px;
  }
}
</style>
