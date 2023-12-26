<template>
  <section class="main">
    <div class="container main-container is-white left-main">
      <div class="left-container">
        <load-more
          v-slot="{ results }"
          :init-data="articlesPage"
          :params="{ tagId: tag.tagId }"
          url="/api/articles/tag/{ tag.tagId }"
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
import { useArticleApi } from '~/api/article'
import Utils from "~/common/utils"

const route = useRoute()
const tagId = route.params.tagid

const tag = ref({})
const articlesPage = ref({})

const getTag = async () => {
  let {data, status, error} = await useArticleApi().getTag(tagId)
  if (status.value === "success" && data.value.success) {
    tag.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

const getArticleTag = async () => {
  let {data, status, error} = await useArticleApi().getArticlesTag(tagId)
  if (status.value === "success" && data.value.success) {
    articlesPage.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

await Promise.all([
  getTag(),
  getArticleTag(),
])

useHead({
  title: Utils.siteTitle(tag.value.tagName + ' - 文章'),
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

<style lang="scss" scoped></style>
