<template>
  <el-card class="box-card my-2">
    <div class="flex flex-row justify-between items-center">
      <div class="flex flex-col items-start">
        <el-link class="topic-title mx-3 my-1" :href="'/topic/' + topic.topicId">
          {{ topic.title }}
        </el-link>
        <div class="flex flex-row justify-between my-1">
          <el-link v-if="topic.node && showNodeId" :href="'/topics/' + topic.node.nodeId" class="mx-1">
            <el-tag>
              <span class="topic-meta">
                {{ topic.node.name }}
              </span>
            </el-tag>
          </el-link>
          <el-link :href="'/user/' + topic.user.id" class="mx-1">
            <span class="topic-meta">
              {{Utils.getUserName(topic.user)}}
            </span>
          </el-link>
          <el-link
            v-if="topic.lastCommentUser?.id"
            :href="'/user/' + topic.lastCommentUser.id"
            class="mx-1"
          >
            <span class="topic-meta">
              最后由
              {{ Utils.getUserName(topic.lastCommentUser) }}
              回复于
              {{ Utils.prettyDate(topic.lastCommentTime) }}
            </span>
          </el-link>
        </div>
      </div>
      <Avatar :user="topic.user"/>
    </div>

    <template #footer v-if="topic.tags">
      <div class="flex flex-row">
        <el-tag v-for="tag in topic.tags" :key="tag.tagId" class="mx-1">
          <el-link :href="'/topics/tag/' + tag.tagId">
            {{ tag.tagName }}
          </el-link>
        </el-tag>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">

import Utils from '~/common/utils'

const props = defineProps({
  topic: {
    type: Object,
    require: true
  },
  showNodeId: {
    type: Boolean,
    default: true,
  }
})

let topic = ref(props.topic)
let showNodeId = ref(props.showNodeId)

</script>

<style scoped lang="scss">
.topic-title {
  font-size: 25px;
}

.topic-meta {
  font-size: 12px;
}

</style>
