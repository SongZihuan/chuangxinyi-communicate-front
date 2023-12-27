<template>
  <section class="main">
    <div class="container main-container is-white left-main">
      <div class="left-container">
        <div class="tabs">
          <ul>
            <li :class="{ 'is-active': activeTab === 'topics' }">
              <a :href="'/user/' + user.id + '?tab=topics'">
                <span>话题</span>
              </a>
            </li>
            <li :class="{ 'is-active': activeTab === 'articles' }">
              <a :href="'/user/' + user.id + '?tab=articles'">
                <span>文章</span>
              </a>
            </li>
            <li>
              <a @click="toHomePage" href="#">
                <span>主页</span>
              </a>
            </li>
          </ul>
        </div>

        <div v-if="activeTab === 'topics'">
          <div v-if="recentTopics && recentTopics.length">
            <topic-list :topics="recentTopics" />
            <div class="more">
              <a :href="'/user/' + user.id + '/topics'">查看更多&gt;&gt;</a>
            </div>
          </div>
          <div v-else class="notification is-primary" style="margin-top: 10px">
            暂无话题
          </div>
        </div>

        <div v-if="activeTab === 'articles'">
          <div v-if="recentArticles && recentArticles.length">
            <article-list :articles="recentArticles" />
            <div class="more">
              <a :href="'/user/' + user.id + '/articles'">查看更多&gt;&gt;</a>
            </div>
          </div>
          <div v-else class="notification is-primary" style="margin-top: 10px">
            暂无文章
          </div>
        </div>
      </div>
      <div class="right-container">
        <user-center-sidebar :user="user" />
        <div class="widget">
          <div class="widget-header">关注</div>
          <div class="widget-content watch-actions">
            <div
              v-if="!isOwner"
              :class="{ active: user.watched }"
              @click="watch(user)"
              class="action watch"
              title="关注"
            >
              <i class="iconfont icon-eye" />
            </div>
            <span v-if="!isOwner" class="split"></span>
            <div v-for="user in userWatchers" :key="user.id">
              <a
                :href="'/user/' + user.id"
                :alt="Utils.getUserName(user)"
                :title="Utils.getUserName(user)"
              >
                <img :src="runtimeConfig.public.AVATAR_URL + '?uid=' + user.uid" class="avatar" alt="头像" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import TopicList from '~/components/TopicList'
import ArticleList from '~/components/ArticleList'
import UserCenterSidebar from '~/components/UserCenterSidebar'
import Utils from '~/common/utils'
import { useUserApi } from '~/api/user'
import { useAuthStore } from '~/store/auth'
import {ElMessage} from "element-plus"

const defaultTab = 'topics'
const route = useRoute()
const userId = route.params.userId

let user = ref({})
let watched = ref({})
let userWatchers = ref({})

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

const getWatched = async () => {
  let {data, status, error} = await useUserApi().watched(userId)
  if (status.value === "success" && data.value.success) {
    watched.value = data.value.data.watched
  } else {
    console.log(status.value, error && error.value)
    showError({
      statusCode: 404,
      message: "用户未找到",
    })
  }
}

const getUserWatcher = async () => {
  let {data, status, error} = await useUserApi().recentwatchers(userId)
  if (status.value === "success" && data.value.success) {
    userWatchers.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
    showError({
      statusCode: 404,
      message: "用户未找到",
    })
  }
}

await Promise.all([
  getUserProfile(),
  getWatched(),
  getUserWatcher(),
])

const activeTab = ref(route.query.tab || defaultTab)
let recentTopics = ref({})
let recentArticles = ref({})

const getRecent = async ()=> {
  if (activeTab.value === 'topics') {
    let {data, status} = await useUserApi().topicesRecent(userId)
    if (status.value ==="success" && data.value.success) {
      recentTopics.value = data.value.data
    }
  } else if (activeTab.value  === 'articles') {
    let {data, status} = await useUserApi().articleRecent(userId)
    if (status.value ==="success" && data.value.success) {
      recentArticles.value = data.value.data
    }
  }
}

await getRecent()

let currentUser = useAuthStore().currentUser
let isOwner = computed(()=>{
  return user.value && currentUser && user.value.id === currentUser.id
})

const runtimeConfig = useRuntimeConfig()
const toHomePage = () => {
  Utils.openTo(runtimeConfig.public.HOME_PAGE + "?userID=" + user.value.uid)
}

const watch = async (user) => {
  if (!currentUser) {
    ElMessage.success('请登录后再关注')
    return
  }

  if (watched.value) {
    let {data, status} = await useUserApi().deleteWatched(user.value.id)
    if (status.value ==="success" && data.value.success) {
      watched.value = false
      user.value.watchCount--
      ElMessage.success('已取消关注！')
      await getUserWatcher()
    }
  } else {
    let {data, status} = await useUserApi().addWatched(user.value.id)
    if (status.value ==="success" && data.value.success) {
      watched.value = true
      user.value.watchCount++
      ElMessage.success('关注成功！')
      await getUserWatcher()
    }
  }
}

useHead({
  title: Utils.siteTitle(Utils.getUserName(user)),
})

</script>

<style lang="scss" scoped>
.tabs {
  margin-bottom: 5px;
}
.more {
  text-align: right;
}
.watch-actions {
  display: flex;
  height: 42px;
  width: max-content;
  padding: 5px 10px 5px 5px;

  background: #fff;
  // border: 1px solid #dae0e4;
  border-radius: 30px;
  vertical-align: middle;

  .avatar {
    margin-left: 5px;
    border: solid 1px #e8ecee;
  }

  .split {
    display: inline-block;
    margin: auto 7px auto 10px;
    height: 16px;
    width: 1px;
    opacity: 0.4;
    background: #dae0e4;
    vertical-align: middle;
  }

  .action {
    margin-left: 5px;
    height: 30px;
    width: 30px;
    line-height: 30px;
    text-align: center;
    color: #e7672e;
    background-color: rgba(126, 107, 1, 0.08);
    border-radius: 50%;
    transition: all 0.5s;
    cursor: pointer;

    i {
      font-size: 16px;
    }

    &:hover,
    &.active {
      color: #fff;
      background-color: #e7672e;
    }
  }
}
</style>
