<template>
  <div class="flex flex-col w-[100%]">
    <div class="my-2">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/user/' + currentUser.id, query: {'tab': 'topics'}}">{{ currentUserName }}</el-breadcrumb-item>
        <el-breadcrumb-item >编辑器</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="my-2">
      <el-form :model="postForm">
        <div class="flex flex-row">
          <el-input v-model="postForm.title" placeholder="请输入标题" class="ml-1" />
        </div>

        <Editor
          v-model="content"
        />
        <TagInput ref="tagInput" v-model="postForm.tags" />

        <div class="flex flex-col items-end my-2">
          <el-button
            :loading="publishing"
            @click="submitCreate"
            type="success"
          >
            发表文章
          </el-button>
        </div>

      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import Utils from '~/common/utils'
import TagInput from '~/components/TagInput'
import {useArticleApi} from '~/api/article'
import {ElMessage} from "element-plus"
import { ArrowRight } from '@element-plus/icons-vue'
import { useAuthStore } from '~/store/auth'

let publishing = ref(false)
let postForm = ref({
  title: '',
  tags: [],
})
let authStore = useAuthStore()

let currentUser = authStore.currentUser
let currentUserName = authStore.currentUserName

let content = ref("")

const submitCreate = async () => {
  if (publishing.value) {
    return
  }
  publishing.value = true
  let {data, status} = await useArticleApi().create({
    title: postForm.value.title,
    content: content.value,
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
