<template>
  <section class="main">
    <div class="container main-container is-white">
      <div class="left-container">
        <div class="widget">
          <div class="widget-header">
            <nav class="breadcrumb">
              <ul>
                <li><a href="/">首页</a></li>
                <li>
                  <a :href="'/user/' + user.id + '?tab=articles'">{{
                      Utils.getUserName(user)
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
                <Editor v-model="editor"></Editor>
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
                  class="button is-link"
                  >发表</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Utils from '~/common/utils'
import TagInput from '~/components/TagInput'
import {useAuthStore} from '~/store/auth'
import {useArticleApi} from '~/api/article'
import {ElMessage} from "element-plus"

let publishing = ref(false)
let postForm = ref({
  title: '',
  tags: [],
  content: ''
})

let editor = ref("")

let user = useAuthStore().currentUser

const submitCreate = async () => {
  if (publishing.value) {
    return
  }
  publishing.value = true
  let {data, status} = await useArticleApi().create({
    title: postForm.value.title,
    content: editor.value,
    tags: postForm.value.tags ? postForm.value.tags.join(',') : ''
  })
  if (status.value === "success" && data.value.success) {
    ElMessage.success("提交成功")
    setTimeout(async ()=>{
      await Utils.linkTo('/article/' + data.value.data.articleId)
    })
  }
  publishing.value = false
}

useHead({
  title: Utils.siteTitle('发表话题')
})
</script>

<style lang="scss" scoped></style>
