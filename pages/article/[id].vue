<template>
  <div class="flex flex-row w-[100%]">
    <div class="flex flex-col w-[80%]">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item> 文章 </el-breadcrumb-item>
        <el-breadcrumb-item> {{ article.title }} </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="mr-2">
        <h1 class="title my-1" itemprop="headline">
          {{ article.title }}
        </h1>
        <div class="flex flex-row flex-wrap my-1">
          <el-link
            :href="'/user/' + article.user.id"
            class="mr-2"
          >
            <el-tag>
              作者：{{ Utils.getUserName(article.user) }}
            </el-tag>
          </el-link>

          <el-text
            v-for="tag in article.tags"
            :key="tag.tagId"
            class="mx-2"
          >
            <el-tag>
              {{tag.tagName}}
            </el-tag>
          </el-text>
        </div>

        <div v-if="isOwner" class="flex flex-col items-end my-2">
          <el-button-group>
            <el-button
              @click="addFavorite"
            >
              <span v-if="favorited"> 取消收藏 </span>
              <span v-else> 收藏 </span>
            </el-button>
            <el-button v-if="isOwner" type="primary" @click="deleteArticle">删除</el-button>
            <el-button v-if="isOwner" type="primary" @click="editArticle">修改</el-button>
          </el-button-group>
        </div>

        <el-divider>
          正文
        </el-divider>

        <div>
          <div>
            <div
              v-html="article.content"
              v-lazy-container="{ selector: 'img' }"
            ></div>
          </div>
        </div>

        <div>
          <Comment
            :entity-id="article.articleId"
            :comment-count="article.commentCount"
            entity-type="article"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-col w-[20%]">
      <div class="ml-2">
        <UserInfo :id="article.user.id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Utils from '~/common/utils'
import { useArticleApi } from '~/api/article'
import { useAuthStore } from '~/store/auth'
import { ElMessage } from "element-plus"
import Comment from '~/components/CommentList.vue'
import { ArrowRight } from '@element-plus/icons-vue'

let article = ref({})
let commentsPage = ref({})
let favorited = ref({})
let newestArticles = ref({})

const route = useRoute()
const articleId = route.params.id

const getArticles = async () => {
  let {data, status, error} = await useArticleApi().getArticle(articleId)
  if (status.value === "success" && data.value.success) {
    article.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
    showError({
      statusCode: 404,
      message: "文章不存在或被删除"
    })
  }
}

const getFavorited = async () => {
  let {data, status, error} = await useArticleApi().favorited(articleId)
  if (status.value === "success" && data.value.success) {
    favorited.value = data.value.data.favorited || false // 如果报错就是false
  } else {
    console.log(status.value, error && error.value)
  }
}

const getComments = async () => {
  let {data, status, error} = await useArticleApi().comments(article.value.articleId)
  if (status.value === "success" && data.value.success) {
    commentsPage.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

const getNewest = async () => {
  let {data, status, error} = await useArticleApi().newest(article.value.user.id)
  if (status.value === "success" && data.value.success) {
    newestArticles.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

await Promise.all([
  getArticles(),  // 要先执行
])

await Promise.all([
  getFavorited(),
  getComments(),
  getNewest(),
])

let keywords = ref('')
let keywordsArr = ref([])
if (article.tags && article.tags.length > 0) {
  article.tags.forEach((tag) => {
    keywordsArr.value.push(tag.tagName)
  })
  if (keywordsArr.value.length > 0) {
    keywords.value = keywordsArr.value.join(',')
  }
}

let description = ref("")
if (article.summary && article.summary.length > 0) {
  description.value = article.summary.substr(0, 128)
  if (article.summary.length > 128) {
    description.value += '...'
  }
}

let user = useAuthStore().currentUser
let isOwner = computed(()=>{
  return user && article.value && user.id === article.value.user.id
})

const deleteArticle = async () => {
  ElMessageBox.confirm(
    '是否确认删除该文章？',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      let {data, status} = await useArticleApi().delete(article.value.articleId)
      if (status.value === "success" && data.value.success) {
        ElMessage.success("删除成功")
        setTimeout(async ()=>{
          await Utils.linkTo('/')
        }, 1000)
      }
    })
    .catch(() => {})
}

const addFavorite = async () => {
  if (favorited.value) {
    let {data, status} = await useArticleApi().favoriteDelete(article.value.articleId)
    if (status.value === "success" && data.value.success) {
      favorited.value = false
      ElMessage.success('已取消收藏！')
    }
  } else {
    let {data, status} = await useArticleApi().favoriteAdd(article.value.articleId)
    if (status.value === "success" && data.value.success) {
      favorited.value = true
      ElMessage.success('收藏成功！')
    }
  }
}

const editArticle = async () => {
  await Utils.linkTo('/article/edit/' + article.value.articleId)
}

useHead({
  title: Utils.siteTitle(article.value.title),
  meta: [
    { name: 'description', content: description.value },
    { name: 'keywords', content: keywords.value }
  ]
})

</script>

<style lang="scss" scoped>
.title{
  font-size: 40px;
}
</style>
