<template>
  <div v-if="articles">
    <Article
      v-for="article in articles"
      :key="article.articleId"
      :article="article"
    />
  </div>
  <div v-else>
    <el-empty description="这里空空如也" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  articles: {
    type: Array,
    default() {
      return []
    },
    required: false
  }
})

let articles = ref(props.articles)

const setArticles = (newArticles: any) => {
  articles.value = newArticles
}

defineExpose({
  setArticles,
})

</script>

<style lang="scss" scoped></style>
