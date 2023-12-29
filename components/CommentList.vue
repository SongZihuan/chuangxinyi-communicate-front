<template>
  <div>
    <el-divider>
      <span> 回帖 </span>
    </el-divider>

    <div v-if="isLogin" class="comment-create">
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
    <div v-else class="comment-not-login">
      <div class="flex flex-row justify-center">
        <el-result
          icon="error"
          title="请先登录再评论"
        >
          <template #extra>
            <el-button type="primary" @click="toLogin">去登录</el-button>
          </template>
        </el-result>

      </div>
    </div>

    <el-divider>
      <span v-if="commentCount > 0">
        评论: {{ commentCount }}
      </span>
      <span v-else>
        评论
      </span>
    </el-divider>

    <LoadMore
      ref="commentsLoadMore"
      v-slot="{ results }"
      :params="{ entityType: entityType, entityId: entityId }"
      url="/api/comments"
    >
      <Comment
        v-for="(comment, index) in results"
        :key="comment.commentId"
        :comment="comment"
        :index="index"
        :entity-id="entityId"
        :entity-type="entityType"
        @reply="reply"
        class="my-2"
      />
    </LoadMore>
  </div>
</template>

<script setup lang="ts">
import Utils from '~/common/utils'
import {useAuthStore} from '~/store/auth'
import {ElMessage} from "element-plus"
import {useCommentApi} from "~/api/comment"
import Comment from '~/components/Comment.vue'

let editorRef = shallowRef()

const props = defineProps({
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
  commentCount: {
    type: Number,
    default: 0
  }
})

let entityType = ref(props.entityType)
let entityId = ref(props.entityId)
let commentCount = ref(props.commentCount)

let content = ref('')
let sending = ref(false)

let commentsLoadMore = ref(null)

let isLogin = computed(() => {
  return useAuthStore().currentUser != null
})

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
    quoteId: ''
  })

  if (status.value === "success" && data.value.success) {
    commentsLoadMore.value.pushResults(data.value.data)
    content.value = ''
    editorRef.value.clear()
  }

  sending.value = false
}
const reply = (newComment: any) => {
  commentCount.value++
  commentsLoadMore.value.pushResults(newComment)
}
const toLogin = async () => {
  await Utils.toSignin()
}

</script>

<style lang="scss" scoped>
.comment-component {
  padding-top: 10px;

  .comment-title {
    font-size: 16px;
    font-weight: 700;
    border-top: 1px solid #f0f0f0;
    // margin: 8px 0;
    padding: 10px 0 5px 0;
  }

  .comment-form {
    .comment-create {
      /*border: 1px solid #f0f0f0;*/
      border-radius: 4px;
      margin-bottom: 10px;
      overflow: hidden;
      position: relative;
      padding: 0;
      box-sizing: border-box;

      .comment-quote-info {
        font-size: 14px;
        color: #000;
        margin-bottom: 5px;

        i.icon-close {
          font-size: 14px !important;
          line-height: 14px;
          color: #448ef6;
          cursor: pointer;
        }

        i.icon-close:hover {
          color: red;
        }
      }

      .comment-input-wrapper {
        margin-bottom: 10px;
      }

      .comment-button-wrapper {
        button {
          float: left;
        }
      }
    }

    .comment-not-login {
      border: 1px solid #f0f0f0;
      border-radius: 0px;
      margin-bottom: 10px;
      overflow: hidden;
      position: relative;
      padding: 10px;
      box-sizing: border-box;

      .comment-login-div {
        color: #d5d5d5;
        cursor: pointer;
        border-radius: 3px;
        padding: 0 10px;

        a {
          margin-left: 10px;
          margin-right: 10px;
        }
      }
    }
  }

  .comments {
    .comment {
      padding: 8px 0;
      overflow: hidden;

      &:not(:last-child) {
        border-bottom: 1px dashed #d1d1d1;
      }

      .comment-avatar {
        float: left;
        padding: 3px;
        margin-right: 5px;

        .avatar {
          min-width: 36px;
          min-height: 36px;
          width: 36px;
          height: 36px;
        }
      }

      .comment-meta {
        position: relative;
        height: 36px;

        .comment-username {
          position: relative;
          font-size: 14px;
          font-weight: 800;
          margin-right: 5px;
          cursor: pointer;
          color: #1abc9c;
          text-decoration: none;
          display: inline-block;
        }
        .comment-floor {
          font-size: 14px;
          color: #7aa87a;
        }
        .comment-time {
          font-size: 12px;
          color: #999999;
          line-height: 1;
          display: inline-block;
          position: relative;
        }

        .comment-reply {
          float: right;
          font-size: 12px;
        }
      }

      .comment-content {
        word-wrap: break-word;
        word-break: break-all;
        text-align: justify;
        color: #4a4a4a;
        font-size: 14px;
        line-height: 1.6;
        position: relative;
        padding-left: 45px;
        margin-top: -5px;
      }

      .comment-quote {
        font-size: 12px;
        padding: 10px 10px;
        border-left: 2px solid #5978f3;

        &::after {
          content: '\201D';
          font-family: Georgia, serif;
          font-size: 60px;
          font-weight: bold;
          color: #aaa;
          position: absolute;
          right: 0px;
          top: -18px;
        }

        .comment-quote-user {
          display: flex;

          .quote-username {
            line-height: 20px;
            font-weight: 700;
            margin-left: 5px;
          }

          .quote-time {
            line-height: 20px;
            margin-left: 5px;
            color: rgba(134, 142, 150, 0.8);
          }
        }
      }
    }
  }
}
</style>
