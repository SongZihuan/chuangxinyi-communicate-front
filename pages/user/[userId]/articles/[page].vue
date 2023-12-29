<template>
  <section class="main">
    <div class="container main-container is-white left-main">
      <div class="left-container">
        <nav class="breadcrumb my-breadcrumb">
          <ul>
            <li><a href="article">首页</a></li>
            <li>
              <a :href="'/user/' + user.id + '?tab=articles'">{{
                  Utils.getUserName(user)
              }}</a>
            </li>
            <li class="is-active">
              <a href="#" aria-current="page">话题列表</a>
            </li>
          </ul>
        </nav>

        <article-list :articles="articlesPage.results" />
        <pagination
          :page="articlesPage.page"
          :url-prefix="'/user/' + user.id + '/articles/'"
        />
      </div>
      <div class="right-container">
        <UserInfo :id="user.id" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ArticleList from '~/components/ArticleList'
import Pagination from '~/components/Pagination'
import { useUserApi } from '~/api/user'
import Utils from "~/common/utils"

const route = useRoute()
const userId = route.params.userId
const page = route.params.page

let user = ref({})
let articlesPage = ref({})

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

const getUserArticles = async () => {
  let {data, status, error} = await useUserApi().articles(userId, page)
  if (status.value === "success" && data.value.success) {
    articlesPage.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

await Promise.all([
  getUserProfile(),
  getUserArticles(),
])

useHead({
  title: Utils.siteTitle(Utils.getUserName(user.value) + ' - 文章')
})

</script>

<style lang="scss" scoped></style>
