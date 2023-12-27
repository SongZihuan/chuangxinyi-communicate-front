<template>
  <section class="main">
    <div class="container main-container left-main">
      <div class="left-container">
        <!--
        <div class="main-content" style="padding: 0;">
          <post-twitter @created="twitterCreated" />
        </div>
      -->
        <div class="main-content">
          <topics-nav :current-tab="0" />
          <topic-list :topics="topicsPage.results" :in-home="false" />
          <pagination :page="topicsPage.page" url-prefix="/topics/newest?p=" />
        </div>
      </div>
      <topic-side :score-rank="scoreRank" :links="links" />
    </div>
  </section>
</template>

<script setup lang="ts">
import TopicSide from '~/components/TopicSide'
import TopicsNav from '~/components/TopicsNav'
import TopicList from '~/components/TopicList'
import Pagination from '~/components/Pagination'
import { useTopicApi } from '~/api/topics'
import { useUserApi } from '~/api/user'
import { useLinksApi } from '~/api/links'
import Utils from '~/common/utils'

let topicsPage = ref({})
let links = ref({})
let scoreRank = ref({})

const route = useRoute()
const page = route.query.p || 1

const getTopics = async () => {
  let {data, status, error} = await useTopicApi().topics(page)
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

const getScoreRank = async () => {
  let {data, status, error} = await useUserApi().scoreRank()
  if (status.value === "success" && data.value.success) {
    scoreRank.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

const getLinks = async () => {
  let {data, status, error} = await useLinksApi().topLinks()
  if (status.value === "success" && data.value.success) {
    links.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

await Promise.all([
  getTopics(),
  getScoreRank(),
  getLinks(),
])

useHead({
  title: Utils.siteTitle('默认 - 话题'),
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: Utils.siteDescription()
    },
    { hid: 'keywords', name: 'keywords', content: Utils.siteKeywords() }
  ],
})
</script>

<style lang="scss" scoped></style>
