<template>
  <div class="flex flex-row w-[100%]">
    <div class="flex flex-col w-[70%]">
      <div class="mr-2">
        <div class="my-2">
          <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/user/' + userId, query: {'tab': 'topics'}}">{{ Utils.getUserName(user) }}</el-breadcrumb-item>
            <el-breadcrumb-item>话题</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <TopicList ref="topicListRef" :topics="topicsPage.results" :show-node-id="true"/>
        <Pagination @change="onChange" :page="topicsPage.page"/>
      </div>
    </div>
    <div class="flex flex-col w-[30%]">
      <UserInfo v-model="user" :id="Number(userId)" />
      <UserWatcher :id="Number(userId)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TopicList from '~/components/TopicList'
import Pagination from '~/components/Pagination'
import { useUserApi } from '~/api/user'
import Utils from "~/common/utils"
import { ArrowRight } from '@element-plus/icons-vue'

const route = useRoute()
const userId = route.params.userId
let page = ref(route.params.page)

let user = ref({})
let topicsPage = ref({})
let topicListRef = shallowRef()

const getUserTopics = async () => {
  let {data, status, error} = await useUserApi().topics(userId, page.value)
  if (status.value === "success" && data.value.success) {
    topicsPage.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

await Promise.all([
  getUserTopics(),
])

const onChange = async (newPage: number) => {
  page.value = newPage
  await getUserTopics()
  topicListRef.value.setTopicList(topicsPage.value.results as any)
}

useHead({
  title: Utils.siteTitle(Utils.getUserName(user.value) + ' - 话题')
})

</script>

<style lang="scss" scoped></style>
