<template>
  <div class="flex flex-col w-[100%]">
    <div class="my-2">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/user/' + user.id, query: {'tab': 'topics'}}">{{ username }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="my-2">
      <el-form :model="postForm">
        <div class="flex flex-row">
          <el-select v-model="postForm.nodeId" placeholder="选择节点" class="mr-1">
            <el-option
              v-for="node in nodes"
              :key="node.nodeId"
              :value="node.nodeId"
              :label="node.name"
            />
          </el-select>
          <el-input v-model="postForm.title" placeholder="请输入标题" class="ml-1" />
        </div>
        <Editor
          v-model="content"
        />
        <TagInput v-model="postForm.tags" />

        <div class="flex flex-col items-end my-2">
          <el-button
            :loading="publishing"
            @click="submitCreate"
            type="success"
          >
            发表主题
          </el-button>
        </div>

      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import Utils from '~/common/utils'
import TagInput from '~/components/TagInput'
import {useTopicApi} from '~/api/topics'
import {useConfigStore} from '~/store/config'
import { useAuthStore } from '~/store/auth'
import { ElMessage } from "element-plus"
import { ArrowRight } from '@element-plus/icons-vue'

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
