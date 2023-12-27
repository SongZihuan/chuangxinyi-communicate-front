<template>
  <section v-loading="listLoading" class="page-container">
    <!--工具条-->
    <div class="toolbar">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.id" placeholder="编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.userId" placeholder="用户编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.title" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="filters.status"
            @change="list"
            clearable
            placeholder="请选择状态"
          >
            <el-option label="正常" value="0"></el-option>
            <el-option label="删除" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-on:click="list" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--列表-->
    <div class="articles main-content">
      <div v-for="item in results" :key="item.id" class="article">
        <div class="article-header">
          <img :src="runtimeConfig.public.AVATAR_URL + '?uid=' + item.user.uid" class="avatar" />
          <div class="article-right">
            <div class="article-title">
              <a :href="'/article/' + item.id" target="_blank">{{
                item.title
              }}</a>
            </div>
            <div class="article-meta">
              <label v-if="item.user" class="author">{{
                item.user.nickname
              }}</label>
              <label>{{ Utils.formatDate(item.createTime) }}</label>
              <label v-for="tag in item.tags" :key="tag.tagId" class="tag">{{
                tag.tagName
              }}</label>
            </div>
          </div>
        </div>
        <div class="summary">{{ item.summary }}</div>
        <div class="article-footer">
          <span v-if="item.status === 1" class="danger">已删除</span>
          <span class="info">编号：{{ item.id }}</span>
          <a @click="deleteSubmit(item)" class="btn">删除</a>
        </div>
      </div>
    </div>

    <!--工具条-->
    <div class="pagebar">
      <el-pagination
        :page-sizes="[20, 50, 100, 300]"
        @current-change="handlePageChange"
        @size-change="handleLimitChange"
        :current-page="page.page"
        :page-size="page.limit"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAdminApi } from '~/api/admin'
import { ElMessage } from "element-plus"
import Utils from '~/common/utils'

definePageMeta({
  layout: "admin",
  middleware: [
    'authenticated',
  ],
})

useHead({
  title: Utils.siteTitle("文章")
})

const runtimeConfig = useRuntimeConfig()

let results = ref([])
let listLoading = ref(false)
let page = ref({})
let filters = ref({
  status: '0'
})

const list = async () => {
  listLoading.value = true

  try {
    const params = Object.assign(filters.value, {
      page: page.value.page,
      limit: page.value.limit
    })

    let {data, status} = await useAdminApi().getArticles(params)
    if (status.value === "success" && data.value.success) {
      results.value = data.value.data.results
      page.value = data.value.data.page
    }
  } finally {
    listLoading.value = false
  }
}

await list()

const handlePageChange = async (val) => {
  page.value.page = val
  await list()
}

const handleLimitChange = async (val) => {
  page.value.limit = val
  await list()
}

const deleteSubmit = async (row) => {
  ElMessageBox.confirm(
    '是否确认删除该文章？',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      let {data, status} = await useAdminApi().deleteArticles(row.id)
      if (status.value === "success" && data.value.success) {
        await list()
        ElMessage.success("删除成功")
      }
    })
    .catch(() => {})
}
</script>

<style scoped lang="scss">
.articles {
  display: table;

  .article:not(:last-child) {
    border-bottom: solid 1px rgba(140, 147, 157, 0.14);
  }

  .article {
    padding-top: 10px;
    padding-bottom: 10px;

    .article-header {
      display: flex;

      .avatar {
        max-width: 50px;
        max-height: 50px;
        min-width: 50px;
        min-height: 50px;
        border-radius: 50%;
      }

      .article-right {
        display: block;
        margin-left: 10px;

        .article-title a {
          color: #555;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          text-decoration: none;
        }

        .article-meta {
          margin-top: 8px;

          label:not(:last-child) {
            margin-right: 5px;
          }

          label {
            color: #999;
            font-size: 12px;
          }

          label.tag {
            align-items: center;
            background-color: #f5f5f5;
            border-radius: 4px;
            color: #4a4a4a;
            display: inline-flex;
            justify-content: center;
            line-height: 1.5;
            padding-left: 5px;
            padding-right: 5px;
            white-space: nowrap;
          }
        }
      }
    }

    .summary {
      margin-top: 10px;
      margin-left: 60px;
      word-break: break-all;
      -webkit-line-clamp: 2;
      overflow: hidden !important;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      display: -webkit-box;
      color: #4a4a4a;
      font-size: 12px;
      font-weight: 400;
      line-height: 1.5;
    }

    .article-footer {
      text-align: right;

      span.info {
        font-size: 12px;
        margin-right: 10px;
        background: #eee;
        padding: 2px 5px 2px 5px;
      }

      span.danger {
        font-size: 12px;
        margin-right: 10px;
        background: #eee;
        color: red;
        padding: 2px 5px 2px 5px;
      }

      a.btn {
        font-size: 12px;
        margin-right: 10px;
        color: blue;
        cursor: pointer;
      }
    }
  }
}
</style>
