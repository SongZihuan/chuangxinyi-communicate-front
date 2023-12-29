<template>
  <div class="flex flex-row w-[100%]">
    <div class="flex flex-col w-[80%]">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="topic.node"> {{ topic.node.name }} </el-breadcrumb-item>
        <el-breadcrumb-item> {{ topic.title }} </el-breadcrumb-item>
      </el-breadcrumb>

      <div class="my-2 mr-2">
        <h1 class="title my-1" itemprop="headline">
          {{ topic.title }}
        </h1>
        <div class="flex flex-row flex-wrap my-1">
          <el-link
            :href="'/user/' + topic.user.id"
            class="mr-2"
          >
            <el-tag>
              作者：{{ Utils.getUserName(topic.user) }}
            </el-tag>
          </el-link>

          <el-tag>
            最后回复时间：{{ Utils.prettyDate(topic.lastCommentTime) }}
          </el-tag>

          <el-link
            class="meta-item mx-2"
            v-if="topic.node"
            :href="'/topics/' + topic.node.nodeId"
          >
            <el-tag>
            {{ topic.node.name }}
            </el-tag>
          </el-link>
          <el-text class="mx-2">
            <el-tag>
              {{ topic.commentCount }}&nbsp;/&nbsp;{{topic.viewCount}}
            </el-tag>
          </el-text>
          <el-link
            v-for="tag in topic.tags"
            :key="tag.tagId"
            :href="'/topics/tag/' + tag.tagId"
            class="mx-2"
          >
            <el-tag>
              {{tag.tagName}}
            </el-tag>
          </el-link>
        </div>

        <div class="my-2 flex flex-row items-center">
          <el-button-group>
            <el-button
              @click="addFavorite"
            >
              <span v-if="favorited"> 取消收藏 </span>
              <span v-else> 收藏 </span>
            </el-button>
            <el-button
              @click="like()"
              class="mr-2"
            >
              <span v-if="topic.likeCount"> 喜欢：{{topic.likeCount}} </span>
              <span v-else> 喜欢 </span>
            </el-button>
          </el-button-group>

          <div class="flex flex-row items-center justify-center">
            <el-badge v-for="user in likeUsers" :key="user.id" :value="user.likeCount > 99 ? '99+' : user.likeCount">
              <Avatar :user="user" class="mx-2" />
            </el-badge>
          </div>

        </div>

        <div v-if="isOwner" class="flex flex-col items-end my-2">
          <el-button-group>
            <el-button type="primary" @click="deleteTopic">删除</el-button>
            <el-button type="primary" @click="editTopic">修改</el-button>
          </el-button-group>
        </div>

        <el-divider>
          正文
        </el-divider>

        <div>
          <div>
            <div
              v-html="topic.content"
              v-lazy-container="{ selector: 'img' }"
            ></div>
          </div>
        </div>

        <div>
          <Comment
            :entity-id="topic.topicId"
            :comment-count="topic.commentCount"
            entity-type="topic"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-col w-[20%]">
      <div class="ml-2">
        <UserInfo :id="topic.user.id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Utils from '~/common/utils'
import Comment from '~/components/CommentList.vue'
import {useTopicApi} from '~/api/topics'
import {useAuthStore} from '~/store/auth'
import {ElMessage} from "element-plus"
import { ArrowRight } from '@element-plus/icons-vue'

const authStore = useAuthStore()
const route = useRoute()
const topicID = route.params.id

let topic = ref({})
let favorited = ref(false)
let likeUsers = ref({})

const getTopic = async () => {
  let {data, status, error} = await useTopicApi().getTopic(topicID)
  if (status.value === "success" && data.value.success) {
    topic.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
    showError({
      statusCode: 404,
      message: "话题未找到",
    })
  }
}

const getFavorited = async () => {
  let {data, status, error} = await useTopicApi().favorited(topicID)
  if (status.value === "success" && data.value.success) {
    favorited.value = data.value?.data?.favorited || false  // 如果没有token，没登陆，favorited回是underfined
  } else {
    console.log(status.value, error && error.value)
    favorited.value = false
  }
}

const getRecentlikes = async () => {
  let {data, status, error} = await useTopicApi().recentlikes(topicID)
  if (status.value === "success" && data.value.success) {
    likeUsers.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
    showError({
      statusCode: 404,
      message: "话题未找到",
    })
  }
}

await Promise.all([
  getTopic(),
  getFavorited(),
  getRecentlikes(),
])

let isOwner = computed(() => {
  return (
    authStore.currentUser &&
    topic.value &&
    authStore.currentUser.id === topic.value.user.id
  )
})

const addFavorite = async () => {
  if (!favorited.value) {
    let {data, status} = await useTopicApi().favoriteAdd(topic.value.topicId)
    if (status.value === "success" && data.value.success) {
      favorited.value = true
      ElMessage.success('已收藏！')
    }
  } else {
    let {data, status} = await useTopicApi().favoriteDelete(topic.value.topicId)
    if (status.value === "success" && data.value.success) {
      favorited.value = false
      ElMessage.success('已取消收藏！')
    }
  }
}

const deleteTopic = async () => {
  ElMessageBox.confirm(
    '是否确认删除该话题？',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      let {data, status} = await useTopicApi().deleteTopic(topic.value.topicId)
      if (status.value === "success" && data.value.success) {
        ElMessage.success("删除成功")
        setTimeout(async ()=>{
          await Utils.linkTo("/")  // huidao 首页
        }, 1000)
      }
    })
    .catch(() => {})
}

const like = async () => {
  ElMessage.success({
    message: '谢谢喜欢！',
    grouping: true,
  })
  let {data, status} = await useTopicApi().likeTopic(topic.value.topicId)
  if (status.value === "success" && data.value.success) {
      await getTopic()
      await getRecentlikes()
  }
}

const editTopic = async () => {
  await Utils.linkTo('/topic/edit/' + topic.value.topicId)
}

useHead({
  title: Utils.siteTitle(topic.value.title),
})

</script>

<style lang="scss" scoped>
.title{
  font-size: 40px;
}
</style>
