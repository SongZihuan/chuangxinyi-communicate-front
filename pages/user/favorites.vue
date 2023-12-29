<template>
  <div class="flex flex-row w-[100%]">
    <div class="flex flex-col w-[70%]">
      <div class="mr-2">
        <div class="my-2">
          <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/user/' + currentUser.id, query: {'tab': 'topics'}}">{{ currentUserName }}</el-breadcrumb-item>
            <el-breadcrumb-item > 收藏列表 </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="my-2">
          <Favorite
            v-for="(item, index) in favoritesList"
            :key="index"
            :item="item"
            class="my-2"
          />
        </div>
        <div class="flex flex-row justify-center">
          <el-button
            v-if="hasMore"
            :loading="loadding"
            @click="list"
          >
            加载更多
          </el-button>
        </div>
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
import Utils from '../../common/utils'
import { useAuthStore } from '~/store/auth'
import { useUserApi } from '~/api/user'
import { ArrowRight } from '@element-plus/icons-vue'

definePageMeta({
  middleware: [
    'authenticated'
  ],
})

let favoritesList = ref([])
let cursor = ref(0)
let hasMore = ref(true)
let loadding = ref(false)

let currentUser = useAuthStore().currentUser
let currentUserName = useAuthStore().currentUserName

const list = async () => {
  loadding.value = true
  let {data, status} = await useUserApi().favorites(cursor.value)
  if (status.value === "success" && data.value.success) {
    if (data.value.data.results && data.value.data.results.length) {
      favoritesList.value = favoritesList.value.concat(data.value.data.results)
    } else {
      hasMore.value = false
      ElMessage.success("见底啦！")
    }
    cursor.value = data.value.data.cursor
  } else {
    hasMore.value = false
    ElMessage.success("见底啦！")
  }
  loadding.value = false
}

await Promise.all([
  list(),
])

useHead({
  title: Utils.siteTitle("喜爱"),
})

</script>

<style lang="scss" scoped>
.article-list {
  margin: 0 !important;

  li {
    padding: 8px 0;
    zoom: 1;
    position: relative;
    overflow: hidden;

    &:not(:last-child) {
      border-bottom: 1px solid #f2f2f2;
    }

    &.more {
      text-align: center;

      a {
        font-size: 15px;
        font-weight: bold;
      }
    }
  }

  .article-item {
    overflow: hidden;
    zoom: 1;
    line-height: 24px;
  }
}

.article-item-left {
  width: 50px;
  height: 50px;
  float: left;
  vertical-align: middle;
}

.article-item-right {
  margin-left: 50px;
  padding-left: 10px;
  vertical-align: middle;
}

article {
  .article-title {
    a {
      color: #999;
      font-weight: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 18px;
      line-height: 30px;
    }
  }

  .article-summary {
    color: #000;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    text-align: justify;
    padding-top: 6px;
    word-break: break-all;
    text-overflow: ellipsis;
    font-size: 14px;
  }

  .article-meta {
    display: inline-block;
    font-size: 13px;
    padding-top: 6px;

    .article-meta-item {
      padding: 0 6px 0 0;
    }

    a {
      color: #3273dc;
    }

    span {
      color: #999;
    }
  }
}
</style>
