<template>
  <section class="main">
    <div class="container main-container">
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
                  <a href="#" aria-current="page">主题</a>
                </li>
              </ul>
            </nav>
          </div>
          <div class="widget-content">
            <div class="field is-horizontal">
              <div class="field-body">
                <div class="field">
                  <div class="select">
                    <select v-model="postForm.nodeId">
                      <option value="0">选择节点</option>
                      <option
                        v-for="node in nodes"
                        :key="node.nodeId"
                        :value="node.nodeId"
                        >{{ node.name }}</option
                      >
                    </select>
                  </div>
                </div>
                <div class="field" style="width:100%;">
                  <input
                    v-model="postForm.title"
                    class="input"
                    type="text"
                    placeholder="请输入标题"
                  />
                </div>
              </div>
            </div>

            <div class="field">
              <div class="control">
                <Editor
                  v-model="content"
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
                  >提交更改</a
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
import { useTopicApi } from '~/api/topics'
import {useAuthStore} from '~/store/auth'
import {ElMessage} from "element-plus"

definePageMeta({
  middleware: [
    'authenticated'
  ],
})

const route = useRoute()
const topicId = route.params.id

let topic = ref({})
let nodes = ref({})

const getEdit = async () => {
  let {data, status, error} = await useTopicApi().getEdit(topicId)
  if (status.value === "success" && data.value.success) {
    topic.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
    showError({
      statusCode: 404,
      message: "话题未找到",
    })
  }
}

const getNodes = async () => {
  let {data, status, error} = await useTopicApi().nodes()
  if (status.value === "success" && data.value.success) {
    nodes.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
    showError({
      statusCode: 404,
      message: "节点未找到",
    })
  }
}

await Promise.all([
  getEdit(),
  getNodes(),
])

let postForm = ref({
  nodeId: topic.value.nodeId,
  title: topic.value.title,
  tags: topic.value.tags,
  content: topic.value.content
})

const authStore = useAuthStore()

let publishing = ref(false)
let currentUser = authStore.currentUser
let currentUserName = authStore.currentUserName

const submitCreate = async () => {
  if (publishing.value) {
    return
  }

  publishing.value = true

  let {data, status} = await useTopicApi().edit(topic.value.topicId, {
    nodeId: postForm.value.nodeId,
    title: postForm.value.title,
    content: content.value,
    tags: postForm.value.tags ? postForm.value.tags.join(',') : ''
  })

  if (status.value === "success" && data.value.success) {
    ElMessage.success('提交成功')
    setTimeout(async () => {
      await Utils.linkTo('/topic/' + data.value.data.topicId)
    }, 1000)
  }
}

useHead({
  title: Utils.siteTitle('修改话题')
})
</script>

<style lang="scss" scoped></style>
