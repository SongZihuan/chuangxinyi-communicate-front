<template>
  <section class="main">
    <div class="container main-container left-main">
      <div class="left-container">
        <div class="widget">
          <div class="widget-header">
            <nav class="breadcrumb">
              <ul>
                <li><a href="/">首页</a></li>
                <li>
                  <a :href="'/user/' + user.id + '?tab=topics'">{{
                    user.username
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
                <markdown-editor
                  ref="mdEditor"
                  v-model="postForm.content"
                  editor-id="topicCreateEditor"
                  placeholder="输入内容，将图片复制或拖入编辑器可上传"
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

const getNodes = async () => {
  let {data, status, error} = await useTopicApi().nodes()
  if (status.value === "success") {
    nodes.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
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
    if (status.value === "success") {
      currentNode.value = data.value.data
    } else {
      console.log(status.value, error && error.value)
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

let user = computed(()=>{
  return authStore.currentUser
})

console.log(authStore.currentUser)

let mdEditor = ref(null)

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

  try {
    let {data, status} = useTopicApi().newTopics({
      nodeId: postForm.value.nodeId,
      title: postForm.value.title,
      content: postForm.value.content,
      tags: postForm.value.tags ? postForm.value.tags.join(',') : ''
    })
    if (status === "success" && data.value.success) {
      mdEditor.value.clearCache()
      ElMessage.info('提交成功')
      setTimeout(()=>{
        utils.linkTo('/topic/' + data.value.data.topicId)
      }, 1000)
    } else {
      publishing.value = false
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
