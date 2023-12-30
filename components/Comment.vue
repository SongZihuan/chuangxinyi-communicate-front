<template>
  <div>
    <el-card v-if="step>0">
      <div class="flex flex-row">
        <el-popover
          placement="top-start"
          :width="400"
          trigger="click"
        >
          <template #reference>
            <el-tag class="mr-1">
              {{ Utils.getUserName(comment.user) }}
            </el-tag>
          </template>

          <UserInfo :id="comment.user.id" />
        </el-popover>

        <el-tag v-if="index !== -1" class="mx-1">
          #{{index+1}}
        </el-tag>

        <el-tag class="mx-1">
          {{ Utils.prettyDate(comment.createTime) }}
        </el-tag>

        <el-link @click="onReply" class="ml-1" v-if="isLogin">
          <span v-if="reply">
            取消回复
          </span>
            <span v-else>
            回复
          </span>
        </el-link>
      </div>
      <div class="comment-content content">
        <div v-if="comment.quote">
          <Comment
            :comment="comment.quote"
            :index="-1"
            :step="step-1"
            :entity-id="entityId"
            :entity-type="entityType"
            @reply="onSonReply"
            class="my-2"
          />
        </div>
        <div
          v-html="comment.content"
          v-lazy-container="{ selector: 'img' }"
        />
      </div>
    </el-card>
    <div v-if="isLogin && reply" class="comment-create">
      <el-form>
        <Editor
          v-model="content"
          ref="editorRef"
        />
      </el-form>
      <div class="flex flex-col items-end">
        <div>
          <el-button @click="create" :loading="sending">
            回复
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Comment'
}
</script>

<script setup lang="ts">
import Utils from "~/common/utils"
import { useAuthStore } from '~/store/auth'
import { ElMessage } from 'element-plus'
import { useCommentApi } from '~/api/comment'

const reply = ref(false)

const props = defineProps({
  comment: {
    type: Object,
    require: true,
  },
  index: {
    type: Number,
    require: true,
  },
  step: {
    type: Number,
    default: 3,
  },
  entityType: {
    type: String,
    default: '',
    required: true
  },
  entityId: {
    type: Number,
    default: 0,
    required: true
  },
})

let content = ref("")
let sending = ref(false)
let comment = ref(props.comment)
let index = ref(props.index)
let step = ref(props.step)
let entityType = ref(props.entityType)
let entityId = ref(props.entityId)
let editorRef = shallowRef()

const emit = defineEmits(["reply"])

let isLogin = computed(() => {
  return useAuthStore().currentUser != null
})

const onReply = () => {
  reply.value = !reply.value
}

const create = async () => {
  if (!content.value || content.value.length < 3) {
    ElMessage.error('请输入评论内容')
    return
  }

  if (sending.value) {
    return
  }
  sending.value = true

  let {data, status} = await useCommentApi().comment({
    entityType: entityType.value,
    entityId: entityId.value,
    content: content.value,
    quoteId: comment.value.commentId,
  })

  if (status.value === "success" && data.value.success) {
    emit("reply", data.value.data)
    content.value = ''
    editorRef.value.clear()
    reply.value = false
  }

  sending.value = false
}

const onSonReply = (newComment: any) => {
  emit("reply", newComment)
}

</script>

<style scoped lang="scss">

</style>
