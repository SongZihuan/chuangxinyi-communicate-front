<template>
  <div class="widget">
    <div class="widget-content content">
      <a :href="createTopicUrl" class="button is-link btn-block">
        <span>发布新话题</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    currentNodeId: {
      type: Number,
      default: 0
    }
  })

  let createTopicUrl = computed(() => {
    let url = '/topic/create'
    if (props.currentNodeId) {
      url += '?nodeId=' + props.currentNodeId
    }
    return url
  })
</script>

<style lang="scss" scoped>
.btn-block {
  display: 100%;
  width: 100%;
}
</style>
