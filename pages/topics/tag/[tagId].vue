<template>
  <section class="main">
    <div class="container main-container is-white left-main">
      <div class="left-container">
        <div class="tag-header">
          <div class="title">
            标签:
            <span class="name">{{ tag.tagName }}</span>
          </div>
        </div>
        <topic-list :topics="topicsPage.results" />
        <pagination
          :page="topicsPage.page"
          :url-prefix="'/topics/' + tag.tagId + '?p='"
        />
      </div>
      <topic-side :score-rank="scoreRank" :links="links" />
    </div>
  </section>
</template>

<script setup lang="ts">
import TopicSide from '~/components/TopicSide'
import TopicList from '~/components/TopicList'
import Pagination from '~/components/Pagination'
import { useTopicApi } from '~/api/topics'
import { useUserApi } from '~/api/user'
import { useLinksApi } from '~/api/links'
import Utils from "~/common/utils"

let tag = ref({})
let topicsPage = ref({})
let links = ref({})
let scoreRank = ref({})

const route = useRoute()
const page = route.query.p || 1
const tagId = route.params.tagId

const getTag = async () => {
  let {data, status, error} = await useTopicApi().tag(tagId)
  if (status.value === "success" && data.value.success) {
    tag.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

const getTopics = async () => {
  let {data, status, error} = await useTopicApi().topicsTag(page, tagId)
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
  getTag(),
  getTopics(),
  getScoreRank(),
  getLinks(),
])

useHead({
  title: Utils.siteTitle(tag.value.tagName + ' - 话题'),
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
.tag-header {
  margin-bottom: 5px;
  border-bottom: 1px solid #f2f2f2;
  padding: 5px 10px;

  .title {
    font-size: 14px;
    color: #999;
    margin-bottom: 8px;
    .name {
      color: #333;
      font-size: 24px;
      margin-left: 10px;
    }
  }
}
</style>
