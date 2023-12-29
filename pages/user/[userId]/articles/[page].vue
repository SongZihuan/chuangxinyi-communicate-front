<template>
  <div class="flex flex-row w-[100%]">
    <div class="flex flex-col w-[70%]">
      <div class="mr-2">
        <div class="my-2">
          <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/user/' + userId, query: {'tab': 'topics'}}">{{ Utils.getUserName(user) }}</el-breadcrumb-item>
            <el-breadcrumb-item>文章</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <ArticleList ref="articleListRef" :articles="articlesPage.results" :show-node-id="true"/>
        <Pagination @change="onChange" :page="articlesPage.page"/>
      </div>
    </div>
    <div class="flex flex-col w-[30%]">
      <UserInfo v-model="user" :id="Number(userId)" />
      <UserWatcher :id="Number(userId)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ArticleList from '~/components/ArticleList'
import Pagination from '~/components/Pagination'
import { useUserApi } from '~/api/user'
import Utils from "~/common/utils"
import { ArrowRight } from '@element-plus/icons-vue'

const route = useRoute()
const userId = route.params.userId
let page = ref(route.params.page)

let user = ref({})
let articlesPage = ref({})
let articleListRef = shallowRef()

const getUserArticles = async () => {
  let {data, status, error} = await useUserApi().articles(userId, page.value)
  if (status.value === "success" && data.value.success) {
    articlesPage.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

await Promise.all([
  getUserArticles(),
])

const onChange = async (newPage: number) => {
  page.value = newPage
  await getUserArticles()
  articleListRef.value.setArticles(articlesPage.value.results as any)
}


useHead({
  title: Utils.siteTitle(Utils.getUserName(user.value) + ' - 文章')
})

</script>

<style lang="scss" scoped></style>
