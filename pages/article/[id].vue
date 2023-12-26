<template>
  <section class="main">
    <div class="container main-container size-360 left-main">
      <div class="left-container">
        <article
          class="article-item article-detail"
          itemscope
          itemtype="http://schema.org/BlogPosting"
        >
          <div class="main-content">
            <div class="article-header">
              <div class="article-item-left">
                <a
                  :href="'/user/' + article.user.id"
                  :title="article.user.username"
                  target="_blank"
                >
                  <img v-lazy="runtimeConfig.public.AVATAR_URL + '?uid=' + article.user.uid" class="avatar" />
                </a>
              </div>
              <div class="article-item-right">
                <h1 class="article-title" itemprop="headline">
                  {{ article.title }}
                </h1>
                <div class="article-meta">
                  <span class="article-meta-item">
                    由
                    <a
                      :href="'/user/' + article.user.id"
                      class="article-author"
                      itemprop="author"
                      itemscope
                      itemtype="http://schema.org/Person"
                      ><span itemprop="name">{{
                        article.user.username
                      }}</span></a
                    >发布于
                    <time
                      :datetime="Utils.formatDate(article.createTime, 'yyyy-MM-ddTHH:mm:ss')"
                      itemprop="datePublished"
                      >{{ Utils.prettyDate(article.createTime) }}</time
                    >
                  </span>

                  <span
                    v-if="article.tags && article.tags.length > 0"
                    class="article-meta-item"
                  >
                    <span
                      v-for="tag in article.tags"
                      :key="tag.tagId"
                      class="article-tag tag"
                    >
                      <a :href="'/articles/' + tag.tagId" class>{{
                        tag.tagName
                      }}</a>
                    </span>
                  </span>
                </div>

                <div class="article-tool">
                  <span v-if="isOwner">
                    <a @click="deleteArticle(article.articleId)">
                      <i class="iconfont icon-delete" />&nbsp;删除
                    </a>
                  </span>
                  <span v-if="isOwner">
                    <a :href="'/article/edit/' + article.articleId">
                      <i class="iconfont icon-edit" />&nbsp;修改
                    </a>
                  </span>
                  <span>
                    <a @click="addFavorite(article.articleId)">
                      <i class="iconfont icon-favorite" />&nbsp;{{
                        favorited ? '已收藏' : '收藏'
                      }}
                    </a>
                  </span>
                </div>
              </div>
            </div>

            <div
              v-html="article.content"
              v-lazy-container="{ selector: 'img' }"
              class="article-content content"
              itemprop="articleBody"
            ></div>
          </div>

          <div class="article-footer">
            <ul>
              <li>
                <strong>免责声明：</strong>
                我们尊重原创，也注重分享。版权原作者所有，如有侵犯您的权益请及时联系（
                <a href="mailto:support@zendea.com">support@zendea.com</a
                >），我们将在24小时之内删除。
              </li>
              <li v-if="article.sourceUrl">
                <strong>原文链接：</strong>
                <a
                  :href="article.sourceUrl"
                  class="source-url"
                  rel="nofollow"
                  target="_blank"
                  >{{ article.sourceUrl }}</a
                >
              </li>
            </ul>
          </div>

          <!-- 评论 -->
          <comment
            :entity-id="article.articleId"
            :comments-page="commentsPage"
            entity-type="article"
          />
        </article>
      </div>
      <div class="right-container">
        <div
          v-if="relatedArticles && relatedArticles.length"
          class="widget no-margin"
        >
          <div class="widget-header">相关文章</div>
          <div class="widget-content article-related">
            <ul>
              <li v-for="a in relatedArticles" :key="a.articleId">
                <a
                  :href="'/article/' + a.articleId"
                  :title="a.title"
                  class="article-related-title"
                  target="_blank"
                  >{{ a.title }}</a
                >
              </li>
            </ul>
          </div>
        </div>

        <div
          v-if="newestArticles && newestArticles.length"
          class="widget no-margin"
        >
          <div class="widget-header">最新文章</div>
          <div class="widget-content article-related">
            <ul>
              <li v-for="a in newestArticles" :key="a.articleId">
                <a
                  :href="'/article/' + a.articleId"
                  :title="a.title"
                  class="article-related-title"
                  target="_blank"
                  >{{ a.title }}</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Utils from '~/common/utils'
import Comment from '~/components/Comment'
import { useArticleApi } from '~/api/article'
import { useAuthStore } from '~/store/auth'
import { ElMessage } from "element-plus"

let article = ref({})
let commentsPage = ref({})
let favorited = ref({})
let newestArticles = ref({})
let relatedArticles = ref({})

const route = useRoute()
const articleId = route.params.id
const runtimeConfig = useRuntimeConfig()

const getArticles = async () => {
  let {data, status, error} = await useArticleApi().getArticle(articleId)
  if (status.value === "success") {
    article.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

const getFavorited = async () => {
  let {data, status, error} = await useArticleApi().favorited(articleId)
  if (status.value === "success") {
    favorited.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

const getComments = async () => {
  let {data, status, error} = await useArticleApi().comments(article.value.articleId)
  if (status.value === "success") {
    commentsPage.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

const getNewest = async () => {
  let {data, status, error} = await useArticleApi().newest(article.value.user.id)
  if (status.value === "success") {
    newestArticles.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

const getRelated = async () => {
  let {data, status, error} = await useArticleApi().getArticle(article.value.articleId)
  if (status.value === "success") {
    relatedArticles.value = data.value.data
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
  getRelated(),
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

const deleteArticle = async (articleId) => {
  if (process.client && !window.confirm('是否确认删除该文章？')) {
    return
  }
  try {
    let {data, status} = await useArticleApi().delete(articleId)
    if (status === "success" && data.value.success) {
      ElMessage.info("删除成功")
      setTimeout(()=>{
        Utils.linkTo('/articles')
      }, 1000)
    } else {
      ElMessage.error("删除失败")
    }
  } catch (e) {
    ElMessage.error('删除失败：' + (e.message || e))
  }
}

const addFavorite = async (articleId) => {
  try {
    if (favorited.value) {
      let {data, status} = await useArticleApi().favoriteDelete(articleId)
      if (status === "success" && data.value.success) {
        favorited = false
        ElMessage.info('已取消收藏！')
      } else {
        ElMessage.error('取消收藏失败')
      }
    } else {
      let {data, status} = await useArticleApi().favoriteAdd(articleId)
      if (status === "success" && data.value.success) {
        favorited = false
        ElMessage.info('收藏成功！')
      } else {
        ElMessage.error('收藏失败')
      }
    }
  } catch (e) {
    console.error(e)
    ElMessage.error('操作：' + (e.message || e))
  }
}

useHead({
  title: Utils.siteTitle(article.value.title),
  meta: [
    { hid: 'description', name: 'description', content: description.value },
    { hid: 'keywords', name: 'keywords', content: keywords.value }
  ]
})

</script>

<style lang="scss" scoped></style>
