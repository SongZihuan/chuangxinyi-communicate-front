<template>
  <section class="main">
    <div class="container main-container is-white left-main">
      <div class="left-container">
        <nav class="breadcrumb my-breadcrumb">
          <ul>
            <li><a href="article">首页</a></li>
            <li>
              <a :href="'/user/' + user.id + '?tab=topics'">{{
                  Utils.getUserName(user)
              }}</a>
            </li>
            <li class="is-active">
              <a href="#" aria-current="page">话题列表</a>
            </li>
          </ul>
        </nav>

        <topic-list :topics="topicsPage.results" />
        <pagination
          :page="topicsPage.page"
          :url-prefix="'/user/' + user.id + '/topics/'"
        />
      </div>
      <div class="right-container">
        <UserInfo :id="user.id" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import TopicList from '~/components/TopicList'
import Pagination from '~/components/Pagination'
import { useUserApi } from '~/api/user'
import Utils from "~/common/utils"

const route = useRoute()
const userId = route.params.userId
const page = route.params.page

let user = ref({})
let topicsPage = ref({})

const getUserProfile = async () => {
  let {data, status, error} = await useUserApi().profile(userId)
  if (status.value === "success" && data.value.success) {
    user.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
    showError({
      statusCode: 404,
      message: "用户未找到",
    })
  }
}

const getUserTopics = async () => {
  let {data, status, error} = await useUserApi().topics(userId, page)
  if (status.value === "success" && data.value.success) {
    topicsPage.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

await Promise.all([
  getUserProfile(),
  getUserTopics(),
])

useHead({
  title: Utils.siteTitle(Utils.getUserName(user.value) + ' - 话题')
})

</script>

<style lang="scss" scoped></style>
