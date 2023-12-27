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
                  <a :href="'/user/' + user.id + '?tab=topics'">{{
                    username
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
                  >发表主题</a
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
import {useTopicApi} from '~/api/topics'
import {useConfigStore} from '~/store/config'
import { useAuthStore } from '~/store/auth'
import { ElMessage } from "element-plus"

definePageMeta({
  middleware: [
    'authenticated'
  ],
})

let nodes = ref({})
let authStore = useAuthStore()
let content = ref("")

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

const configStore = useConfigStore()
const route = useRoute()
let currentNode = ref({})
let postForm = ref({
  nodeId: 0,
  title: '',
  tags: [],
  content: ''
})

const getNode = async () => {
  const setting = configStore.setting || {}
  const nodeId = route.query.nodeId || setting.defaultNodeId
  if (nodeId) {
    let {data, status, error} = await useTopicApi().getNode(nodeId)
    if (status.value === "success" && data.value.success) {
      currentNode.value = data.value.data
    } else {
      console.log(status.value, error && error.value)
      showError({
        statusCode: 404,
        message: "节点未找到",
      })
    }
  }

  postForm.value = {
    nodeId: currentNode.value ? currentNode.value.nodeId : 0
  }
}

await Promise.all([
  getNodes(),
  getNode(),
])

let publishing = ref(false)

let user = authStore.currentUser
let username = authStore.currentUserName

const submitCreate = async () => {
  if (publishing.value) {
    return
  }

  if (!postForm.value.title) {
    ElMessage.error('请输入标题')
    return
  }

  if (!postForm.value.nodeId) {
    ElMessage.error('请选择节点')
    return
  }

  publishing.value = true

  let {data, status} = await useTopicApi().newTopics({
    nodeId: postForm.value.nodeId,
    title: postForm.value.title,
    content: content.value,
    tags: postForm.value.tags ? postForm.value.tags.join(',') : ''
  })
  if (status.value === "success" && data.value.success) {
    ElMessage.success('提交成功')
    setTimeout(()=>{
      Utils.linkTo('/topic/' + data.value.data.topicId)
    }, 1000)
  }
}

useHead({
  title: Utils.siteTitle('发表话题')
})
</script>

<style lang="scss" scoped></style>
