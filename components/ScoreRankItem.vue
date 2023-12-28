<template>
<div class="flex flex-row">
  <Avatar :user="user" class="mx-1" />
  <div class="mx-1">
    <div class="flex flex-col items-start">
      <el-link :href="'/user/' + user.id">{{ Utils.getUserName(user) }}</el-link>
      <el-text>{{ user.topicCount }} 帖子 • {{ user.commentCount }} 评论 • {{ user.score }} 积分</el-text>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import Utils from "~/common/utils"

const props = defineProps({
  user: {
    type: Object,
    require: true,
  }
})

let user = ref(props.user)

</script>

<style scoped lang="scss">

</style>
