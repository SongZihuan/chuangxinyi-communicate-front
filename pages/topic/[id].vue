<template>
  <div class="flex flex-row w-[100%]">
    <div class="flex flex-col w-[80%]">
      <div class="mr-2">
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
              :class="{ active: favorited }"
              @click="addFavorite(topic.topicId)"
            >
              <span v-if="favorited"> 取消收藏 </span>
              <span v-else> 收藏 </span>
            </el-button>
            <el-button
              @click="like(topic)"
              class="mr-2"
            >
              <span v-if="topic.likeCount"> 喜欢：{{topic.likeCount}} </span>
              <span v-else> 喜欢 </span>
            </el-button>
          </el-button-group>

          <div class="flex flex-row items-center justify-center">
            <Avatar v-for="user in likeUsers" :key="user.id" :user="user" class="mx-2" />
          </div>

        </div>

        <div v-if="isOwner" class="flex flex-col items-end my-2">
          <el-button-group>
            <el-button type="primary" @click="deleteTopic(topic.topicId)">删除</el-button>
            <!-- 话题类型为普通时才可以修改 -->
            <el-button v-if="topic.type === 0" type="primary" @click="editTopic(topic.topicId)">修改</el-button>
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
        <UserInfo :user="topic.user" />
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
import { useAdminApi } from '~/api/admin'

const authStore = useAuthStore()
const route = useRoute()
const topicID = route.params.id

const runtimeConfig = useRuntimeConfig()
let topic = ref({})
let favorited = ref(false)
let likeUsers = ref({})

let toc = ref(null)

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

const addFavorite = async (topicId) => {
  if (!favorited.value) {
    let {data, status} = await useTopicApi().favoriteAdd(topicId)
    if (status.value === "success" && data.value.success) {
      favorited.value = true
      ElMessage.success('已收藏！')
    }
  } else {
    let {data, status} = await useTopicApi().favoriteDelete(topicId)
    if (status.value === "success" && data.value.success) {
      favorited.value = false
      ElMessage.success('已取消收藏！')
    }
  }
}

const deleteTopic = async (topicId) => {
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
     ElMessage.error("话题不支持删除哦！")
    })
    .catch(() => {})
}

const like = async (topic) => {
  ElMessage.success({
    message: '谢谢喜欢！',
    grouping: true,
  })
  let {data, status} = await useTopicApi().likeTopic(topic.topicId)
  if (status.value === "success" && data.value.success) {
      topic.value.liked = true
      topic.value.likeCount++
      likeUsers.value = likeUsers.value || []
      likeUsers.value.unshift(authStore.currentUser)
  }
}

const editTopic = async (topicId) => {
  await Utils.linkTo('/topic/edit/' + topic.topicId)
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
