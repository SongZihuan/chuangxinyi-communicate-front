<template>
  <div v-if="topics">
    <Topic
      v-for="topic in topics"
      :key="topic.topicId"
      :topic="topic"
      :show-node-id="showNodeId"
    />
  </div>
  <div v-else>
    <el-empty description="这里空空如也" />
  </div>

</template>

<script setup lang="ts">

const props = defineProps({
  topics: {
    type: Array,
    default() {
      return []
    },
    required: false
  },
  inHome: {
    type: Boolean,
    default: false
  },
  showNodeId: {
    type: Boolean,
    default: true
  }
})

let topics = ref(props.topics)
let showNodeId = ref(props.showNodeId)

const setTopicList = (newTopics: any) => {
  topics.value = newTopics
}

defineExpose({
  setTopicList,
})

</script>

<style lang="scss" scoped></style>
