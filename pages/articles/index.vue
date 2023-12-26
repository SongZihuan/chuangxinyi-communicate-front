<template>
  <section class="main">
    <div class="container main-container is-white left-main">
      <div class="sidebar-container">
        <div class="widget">
          <div class="widget-header">推荐标签</div>
          <div class="widget-content">
            <ul class="list-group">
              <li
                v-for="tag in tagsPage.results"
                :key="tag.tagId"
                class="list-group-item"
              >
                <a :href="'/articles/tag/' + tag.tagId" :title="tag.tagName">
                  <i class="iconfont icon-tag"></i> {{ tag.tagName }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="left-container">
        <load-more
          v-slot="{ results }"
          :init-data="articlesPage"
          url="/api/articles"
        >
          <article-list :articles="results" :show-ad="true" />
        </load-more>
      </div>
      <div class="right-container">
        <site-notice />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ArticleList from '~/components/ArticleList'
import SiteNotice from '~/components/SiteNotice'
import LoadMore from '~/components/LoadMore'
import { useArticleApi } from '~/api/article'
import Utils from "~/common/utils"

let articlesPage = ref({})
let tagsPage = ref({})

const getArticles = async () => {
  let {data, status, error} = await useArticleApi().articles()
  if (status.value === "success") {
    articlesPage.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

const getTags = async () => {
  let {data, status, error} = await useArticleApi().tags()
  if (status.value === "success") {
    tagsPage.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

await Promise.all([
  getArticles(),
  getTags(),
])

useHead({
  title: Utils.siteTitle('文章'),
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: Utils.siteDescription()
    },
    { hid: 'keywords', name: 'keywords', content: Utils.siteKeywords() }
  ]
})

</script>

<style lang="scss" scoped>
.sidebar-container {
  margin-right: 15px;
  min-width: 160px;
  max-width: 160px;
}
</style>
