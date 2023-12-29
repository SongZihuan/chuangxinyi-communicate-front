<template>
  <el-card class="box-card my-2">
    <div class="flex flex-row justify-between items-center">
      <div class="flex flex-col items-start">
        <el-link class="article-title mx-3 my-1" :href="'/article/' + article.articleId">
          {{ article.title }}
        </el-link>
        <div class="flex flex-row justify-between my-1">
          <el-link :href="'/user/' + article.user.id" class="mx-1">
            <span class="article-mate">
              {{Utils.getUserName(article.user)}}
            </span>
          </el-link>
          <el-link
            v-if="article.lastCommentUser?.id"
            :href="'/user/' + article.lastCommentUser.id"
            class="mx-1"
          >
            <span class="article-mate">
              最后由
              {{ Utils.getUserName(article.lastCommentUser) }}
              回复于
              {{ Utils.prettyDate(article.lastCommentTime) }}
            </span>
          </el-link>
        </div>
      </div>
      <Avatar :user="article.user"/>
    </div>

    <template #footer v-if="article.tags">
      <div class="flex flex-row">
        <el-tag v-for="tag in article.tags" :key="tag.tagId" class="mx-1">
            {{ tag.tagName }}
        </el-tag>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import Utils from '~/common/utils'

const props = defineProps({
  article: {
    type: Object,
    require: true
  },
})

let article = ref(props.article)

</script>

<style scoped lang="scss">
.article-title {
  font-size: 25px;
}

.article-mate {
  font-size: 12px;
}
</style>
