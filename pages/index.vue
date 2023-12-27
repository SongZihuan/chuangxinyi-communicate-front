<template>
  <section class="main">
    <div class="container main-container left-main">
      <div class="left-container">
        <div class="main-content">
          <TopicsNav />
          <TopicList :topics="topicsPage.results" :show-ad="true" />
          <Pagination :page="topicsPage.page" url-prefix="/topics?p=" />
        </div>
      </div>
      <TopicSide :score-rank="scoreRank" :links="links" :stat="stat" />
    </div>
  </section>
</template>

<script setup lang="ts">
import TopicSide from '~/components/TopicSide'
import TopicsNav from '~/components/TopicsNav'
import TopicList from '~/components/TopicList'
import Pagination from '~/components/Pagination'
import { useStatApi } from '~/api/stat'
import { useTopicApi } from '~/api/topics'
import { useLinksApi } from '~/api/links'
import { useUserApi } from '~/api/user'
import Utils from "~/common/utils"

const topicsPage = ref({})
const scoreRank = ref([])
const links = ref([])
const stat = ref({})

const getTopics = async () => {
  let {data, status, error} = await useTopicApi().topics(1)
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

const getUserScoreRand = async () => {
  let {data, status, error} = await useUserApi().scoreRank()
  if (status.value === "success" && data.value.success) {
    scoreRank.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

const getLinksTop = async () => {
  let {data, status, error} = await useLinksApi().topLinks()
  if (status.value === "success" && data.value.success) {
    links.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

const getStat = async () => {
  let {data, status, error} = await useStatApi().stat()
  if (status.value === "success" && data.value.success) {
    stat.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

await Promise.all([
  getTopics(),
  getUserScoreRand(),
  getLinksTop(),
  getStat(),
])

useHead({
  title: Utils.siteTitle("社区"),
  meta: [
    {
      name: 'description',
      content: Utils.siteDescription(),
    },
    { name: 'keywords', content: Utils.siteKeywords() },
  ],
})

</script>

<style lang="scss" scoped></style>
