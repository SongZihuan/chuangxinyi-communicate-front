<template>
  <section class="main">
    <div class="container main-container is-white left-main">
      <div class="left-container">
        <div class="widget">
          <div class="widget-header">
            <nav class="breadcrumb">
              <ul>
                <li><a href="/">首页</a></li>
                <li>
                  <a :href="'/user/' + currentUser.id + '?tab=topics'">{{
                      currentUserName
                  }}</a>
                </li>
                <li class="is-active">
                  <a href="#" aria-current="page">文章</a>
                </li>
              </ul>
            </nav>
          </div>
          <div class="widget-content">
            <div class="field">
              <div class="control">
                <input
                  v-model="postForm.title"
                  class="input"
                  type="text"
                  placeholder="标题"
                />
              </div>
            </div>

            <div class="field">
              <div class="control">
                <markdown-editor
                  v-model="postForm.content"
                  editor-id="articleEditEditor"
                  placeholder="请输入内容，将图片复制或拖入编辑器可上传"
                />
              </div>
            </div>

            <div class="field">
              <div class="control">
                <tag-input v-model="postForm.tags" />
              </div>
            </div>

            <div class="field is-grouped">
              <div class="control">
                <a
                  :class="{ 'is-loading': publishing }"
                  :disabled="publishing"
                  @click="submitCreate"
                  class="button is-success"
                  >提交更改</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-container">
        <markdown-help />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import TagInput from '~/components/TagInput'
import MarkdownHelp from '~/components/MarkdownHelp'
import MarkdownEditor from '~/components/MarkdownEditor'
import { useTopicApi } from '~/api/topics'
import { useAuthStore } from '~/store/auth'
import {ElMessage} from "element-plus"
import Utils from "~/common/utils"

definePageMeta({
  middleware: [
    'authenticated'
  ],
})

const route = useRoute()
const articleId = route.params.id

let article = ref({})

const getEdis = async () => {
  let {data, status, error} = await useTopicApi().getEdit(articleId)
  if (status.value === "success") {
    article.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

await Promise.all([
  getEdis(),
])

let publishing = ref(false)
let postForm = ref({
  title: article.value.title,
  tags: article.value.tags,
  content: article.value.content
})

let currentUser = useAuthStore().currentUser
let currentUserName = useAuthStore().currentUserName

const submitCreate = async () => {
  if (publishing.value) {
    return
  }

  publishing.value = true

  try {
    let {data, status} = await useArticleApi().edit(article.value.articleId, {
      title: postForm.value.title,
      content: postForm.value.content,
      tags: postForm.value.tags ? postForm.value.tags.join(',') : ''
    })
    if (status.value === "success" && data.value.success) {
      ElMessage.success('修改成功')
      setTimeout(()=>{
        utils.linkTo('/article/' + article.articleId)
      }, 1000)
    } else {
      publishing.value = true
      ElMessage.error('提交失败')
    }
  } catch (e) {
    console.error(e)
    publishing.value = false
    ElMessage.error('提交失败：' + (e.message || e))
  }
}

useHead({
  title: Utils.siteTitle('发表话题')
})
</script>

<style lang="scss" scoped></style>
