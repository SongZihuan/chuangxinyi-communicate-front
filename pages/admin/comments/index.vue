<template>
  <div class="flex flex-col my-2">
    <div class="flex flex-row my-2">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.id" placeholder="编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.userId" placeholder="用户编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="filters.entityType"
            @change="list"
            clearable
            placeholder="请选择类型"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="话题" value="topic"></el-option>
            <el-option label="文章" value="article"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.entityId" placeholder="上级编号">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="filters.status"
            @change="list"
            clearable
            placeholder="请选择状态"
          >
            <el-option label="全部" value="-1"></el-option>
            <el-option label="正常" value="0"></el-option>
            <el-option label="删除" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-on:click="list" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="flex flex-row flex-wrap justify-start w-[100%]" v-loading="listLoading">
      <el-card v-for="item in results" :key="item.id" class="mx-2 my-2 w-[100%]">
        <div class="comment-item">
          <div>
            <div class="flex flex-row justify-start items-center">
              <Avatar :user="item.user" class="m-1" />
              <div class="flex flex-col items-start justify-center">
                <el-link :href="'/user/'+item.user.id" v-if="item.user">
                  {{ Utils.getUserName(item.user )}}
                </el-link>
                <el-link v-if="item.entityType === 'article'" :href="'/article/' + item.entityId">
                  文章：{{ item.entityId }}
                </el-link>
                <el-link v-else :href="'/topic/' + item.entityId">
                  话题：{{ item.entityId }}
                </el-link>
              </div>
            </div>
          </div>

          <div class="my-2">
            <div v-html="item.content" class="summary"></div>
          </div>
        </div>
        <template #footer>
          <div class="topic-footer">
            <el-button :disabled="item.status !== 0" @click="handleDelete(item)" class="m-1">删除</el-button>
          </div>
        </template>
      </el-card>
    </div>

    <div class="flex flex-col items-end my-2">
      <el-pagination
        :page-sizes="[20, 50, 100, 300]"
        @current-change="handlePageChange"
        @size-change="handleLimitChange"
        :current-page="page.page"
        :page-size="page.limit"
        :total="page.total"
        layout="total, sizes, prev, pager, jumper, next"
      >
      </el-pagination>
    </div>
  </div>
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
  title: Utils.siteTitle("评论")
})

const runtimeConfig = useRuntimeConfig()

let results = ref([])
let listLoading = ref(false)
let page = ref({})
let filters = ref({
  id: '',
  userId: '',
  entityType: '',
  entityId: '',
  status: '-1'
})

const list = async () => {
  listLoading.value = true

  try {
    const params = Object.assign(filters.value, {
      page: page.value.page,
      limit: page.value.limit
    })

    let {data, status} = await useAdminApi().getComment(params)
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

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '是否确认删除该评论？',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      let {data, status} = await useAdminApi().deleteComment(row.id)
      if (status.value === "success" && data.value.success) {
        await list()
        ElMessage.success("删除成功")
      } else {
        ElMessage.success("删除失败")
      }
    })
    .catch(() => {})
}
</script>

<style scoped lang="scss">
.comments {
  list-style: none;
  padding: 0px;

  li {
    border-bottom: 1px solid #f2f2f2;
    padding-top: 10px;
    padding-bottom: 10px;

    .comment-item {
      display: flex;

      .avatar {
        min-width: 40px;
        min-height: 40px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
      }

      .content {
        width: 100%;
        .meta {
          span {
            &:not(:last-child) {
              margin-right: 5px;
            }

            font-size: 13px;
            color: #999;
            font-weight: bold;

            &.nickname {
              color: #1a1a1a;
              font-size: 14px;
              font-weight: bold;
            }

            &.create-time {
              color: #999;
              font-size: 13px;
              font-weight: normal;
            }
          }
        }

        .summary {
          font-size: 15px;
          color: #555;
        }

        .tools {
          float: right;
          .item {
            color: blue;
            cursor: pointer;
            &:not(:last-child) {
              margin-right: 10px;
            }

            &.info {
              color: red;
            }
          }
        }
      }
    }
  }
}
</style>
