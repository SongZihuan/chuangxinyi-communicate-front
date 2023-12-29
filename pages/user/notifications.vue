<template>
  <div class="flex flex-row w-[100%]">
    <div class="flex flex-col w-[70%]">
      <div class="mr-2">
        <div class="my-2">
          <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/user/' + currentUser.id, query: {'tab': 'topics'}}">{{ currentUserName }}</el-breadcrumb-item>
            <el-breadcrumb-item > 站内信 </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
<!--        还未完成-->
      </div>
    </div>
    <div class="flex flex-col w-[30%]">
      <div class="ml-2">
        <UserInfo :id="currentUser.id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Utils from "~/common/utils"
import { useAuthStore } from '~/store/auth'
import { ArrowRight } from '@element-plus/icons-vue'

definePageMeta({
  middleware: [
    'authenticated'
  ],
})

let messagesPage = ref({})

const getMessage = async () => {
  // 对接用户中心
  messagesPage.value = {
    results: [],
    page: {
      page: 1,
      limit: 20,
      total: 0,
    }
  }
}

await Promise.all([
  getMessage(),
])

let currentUser = useAuthStore().currentUser
let currentUserName = useAuthStore().currentUserName

useHead({
  title: Utils.siteTitle("通知"),
})

</script>

<style lang="scss" scoped>
.message-list {
  li.message-item {
    padding: 8px 0;
    zoom: 1;
    position: relative;
    overflow: hidden;
    display: flex;

    &:not(:last-child) {
      border-bottom: 1px solid #f2f2f2;
    }

    .message-item-left {
      img {
        width: 50px;
        height: 50px;
        min-width: 50px;
        min-height: 50px;
        border-radius: 50%;
      }
    }

    .message-item-right {
      margin-left: 10px;
      width: 100%;

      .message-item-meta {
        span.username {
          font-size: 16px;
          font-weight: bold;
        }

        span.time {
          font-size: 13px;
          color: #999;
        }
      }

      .content {
        margin-top: 5px;
        margin-bottom: 0px;

        .message-content {
          font-size: 15px;
          font-weight: 400;
          color: #000;

          .show-more {
            text-align: right;
            margin-left: 5px;
          }
        }

        .message-quote {
          margin: 8px 0;
          padding: 8px;
          font-size: 13px;
          font-weight: 400;
          color: #4a4a4a;
        }
      }
    }
  }
}
</style>
