<template>
  <div class="flex flex-col justify-center my-2">
    <el-button type="primary" @click="onClick">
      发表新话题
    </el-button>
  </div>
</template>

<script setup lang="ts">
  import Utils from "~/common/utils"
  const props = defineProps({
    currentNodeId: {
      type: Number,
      default: 0
    },
    currentTag: {
      type: String,
      default: ""
    }
  })

  const onClick = async () => {
    let url = '/topic/create'
    if (props.currentNodeId) {
      url += '?nodeId=' + props.currentNodeId
    } else if (props.currentTag) {
      url += '?tag=' + props.currentTag
    }
    await Utils.linkTo(url)
  }
</script>

<style lang="scss" scoped>
.btn-block {
  display: 100%;
  width: 100%;
}
</style>
