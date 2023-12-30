<template>
  <el-card>
    <template #header>
      <div>
        {{ msg.title }}
      </div>
    </template>

    <div style="white-space: pre-wrap;">
      {{ msg.content }}
    </div>

    <template #footer>
      <el-text class="mr-2">
        发送人：
        <el-link v-if="msg.senderLink" :href="msg.senderLink">
          {{ msg.sender }}
        </el-link>
        <el-text v-else>
          {{ msg.sender }}
        </el-text>
      </el-text>

      <el-tag class="mx-2">
        {{ Utils.formatDate(msg.createAt * 1000) }}
      </el-tag>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import Utils from "~/common/utils"

const props = defineProps({
  msg: {
    type: Object,
    require: true,
  }
})

let msg = ref(props.msg)
console.log("MSG: ", props.msg)
</script>

<style scoped lang="scss">

</style>
