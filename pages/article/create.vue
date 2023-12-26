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
                  <a :href="'/user/' + user.id + '?tab=articles'">{{
                    user.username
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
                  ref="mdEditor"
                  v-model="postForm.content"
                  editor-id="articleCreateEditor"
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
                  class="button is-link"
                  >发表</a
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
import Utils from '~/common/utils'
import TagInput from '~/components/TagInput'
import MarkdownHelp from '~/components/MarkdownHelp'
import MarkdownEditor from '~/components/MarkdownEditor'
import {useAuthStore} from '~/store/auth'
import {useArticleApi} from '~/api/article'
import {ElMessage} from "element-plus"


let publishing = ref(false)
let postForm = ref({
  title: '',
  tags: [],
  content: ''
})

let user = useAuthStore().currentUser

const submitCreate = async () => {
  if (publishing.value) {
    return
  }
  publishing.value = true
  try {
    let {data, status} = await useArticleApi().create({
      title: postForm.value.title,
      content: postForm.value.content,
      tags: postForm.value.tags ? postForm.value.tags.join(',') : ''
    })
    if (status.value === "success" && data.value.success) {
      ElMessage.info("提交成功")
      setTimeout(()=>{
        Utils.linkTo('/article/' + data.value.data.articleId)
      })
    } else {
      publishing.value = false
      ElMessage.error("提交失败")
    }
  } catch (e) {
    publishing.value = false
    ElMessage.error('提交失败：' + (e.message || e))
  }
}

useHead({
  title: Utils.siteTitle('发表话题')
})
</script>

<style lang="scss" scoped></style>
