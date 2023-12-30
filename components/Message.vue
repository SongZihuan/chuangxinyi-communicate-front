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

      <el-tag v-if="!msg.readAt" type="danger" @click="readMsg(msg.id)">
        未读
      </el-tag>

    </template>
  </el-card>
</template>

<script setup lang="ts">
import Utils from "~/common/utils"
import { useMsgApi } from '~/api/msg'

const props = defineProps({
  msg: {
    type: Object,
    require: true,
  }
})

let msg = ref(props.msg)

const readMsg = async (id: number) => {
  let {data, status} = await useMsgApi().readMessage(id)
  if (status.value === "success" && data.value.code === "SUCCESS") {
    msg.value.readAt = 1
  }
}

</script>

<style scoped lang="scss">

</style>
