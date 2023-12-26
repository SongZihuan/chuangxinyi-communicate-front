<template>
  <section class="main">
    <div class="container main-container is-white left-main">
      <div class="left-container">
        <div class="widget">
          <div class="widget-header">
            <nav class="breadcrumb">
              <ul>
                <li><a href="/">首页</a></li>
                <li>
                  <a :href="'/user/' + currentUser.id">{{
                    currentUser.username
                  }}</a>
                </li>
                <li class="is-active">
                  <a href="#" aria-current="page">收藏列表</a>
                </li>
              </ul>
            </nav>
          </div>

          <div class="widget-content">
            <ul v-if="favorites && favorites.length" class="article-list">
              <li v-for="favorite in favorites" :key="favorite.favoriteId">
                <article v-if="favorite.deleted" class="article-item">
                  <div class="article-summary">
                    收藏内容失效!!!
                  </div>
                </article>
                <article v-else class="article-item">
                  <div class="article-item-left">
                    <a :href="'/user/' + favorite.user.id" target="_blank">
                      <img v-lazy="$config.AVATAR_URL + '?uid=' + favorite.user.uid" class="avatar" />
                    </a>
                  </div>

                  <div class="article-item-right">
                    <div class="article-title">
                      <a :href="favorite.url">{{ favorite.title }}</a>
                    </div>

                    <div class="article-summary">
                      {{ favorite.content }}
                    </div>

                    <div class="article-meta">
                      <span class="article-meta-item"
                        ><a :href="'/user/' + favorite.user.id">{{
                          favorite.user.username
                        }}</a></span
                      >
                      <span class="article-meta-item">
                        <time>
                          {{ Utils.prettyDate(favorite.createTime) }}
                        </time>
                      </span
                      >
                    </div>
                  </div>
                </article>
              </li>
              <li v-if="hasMore" class="more">
                <a @click="list">查看更多&gt;&gt;</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="right-container">
        <user-center-sidebar :user="currentUser" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import UserCenterSidebar from '~/components/UserCenterSidebar'
import Utils from '../../common/utils'
import { useAuthStore } from '~/store/auth'
import { useUserApi } from '~/api/user'

definePageMeta({
  middleware: [
    'authenticated'
  ],
})

let favorites = ref([])
let cursor = ref(0)
let hasMore = ref(false)

let currentUser = useAuthStore().currentUser

const list = async () => {
  let {data, status} = await useUserApi().favorites(cursor.value)
  if (status.value === "success" && data.value.success) {
    if (data.value.data.results && data.value.data.results.length) {
      favorites.value = favorites.value.concat(data.value.data.results)
    } else {
      hasMore.value = false
    }
    cursor.value = data.value.data.cursor
  } else {
    hasMore.value = false
  }
}

await Promise.all([
  list(),
])
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
