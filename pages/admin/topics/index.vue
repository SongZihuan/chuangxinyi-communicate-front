<template>
  <section v-loading="listLoading" class="page-container">
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
            v-model="filters.recommend"
            @change="list"
            clearable
            placeholder="是否推荐"
          >
            <el-option label="推荐" value="1"></el-option>
            <el-option label="未推荐" value="0"></el-option>
          </el-select>
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
    <div class="pagebar">
      <el-pagination
        :page-sizes="[20, 50, 100, 300]"
        @current-change="handlePageChange"
        @size-change="handleLimitChange"
        :current-page="page.page"
        :page-size="page.limit"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
    <div class="topics main-content">
      <div v-for="(item, index) in results" :key="item.id" class="topic">
        <div class="topic-header">
          <img :src="runtimeConfig.public.AVATAR_URL + '?uid=' + item.user.uid" class="avatar" />
          <div class="topic-right">
            <div class="topic-title">
              <a :href="'/topic/' + item.id" target="_blank">{{
                item.title
              }}</a>
            </div>
            <div class="topic-meta">
              <label v-if="item.user" class="author">{{
                item.user.nickname
              }}</label>
              <label>{{ Utils.formatDate(item.createTime) }}</label>
              <label class="node">{{ item.node ? item.node.name : '' }}</label>
              <label v-for="tag in item.tags" :key="tag.tagId" class="tag">{{
                tag.tagName
              }}</label>
            </div>
          </div>
        </div>

        <div class="summary">
          {{ item.summary }}
        </div>

        <div class="topic-footer">
          <span v-if="item.status === 1" class="danger">已删除</span>
          <span class="info">编号：{{ item.id }}</span>

          <a @click="handleEdit(index, item)" class="btn"
          >编辑</a
          >

          <a v-if="item.status === 0" @click="deleteSubmit(item)" class="btn"
            >删除</a
          >
          <a v-else @click="undeleteSubmit(item)" class="btn">取消删除</a>

          <a v-if="!item.recommend" @click="recommend(item.id)" class="btn"
            >推荐</a
          >
          <a v-else @click="cancelRecommend(item.id)" class="btn">取消推荐</a>
        </div>
      </div>
    </div>

    <div class="pagebar">
      <el-pagination
        :page-sizes="[20, 50, 100, 300]"
        @current-change="handlePageChange"
        @size-change="handleLimitChange"
        :current-page="page.page"
        :page-size="page.limit"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
      >
      </el-pagination>
    </div>

    <el-dialog
      v-model="editFormVisible"
      :close-on-click-modal="false"
      title="编辑"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
      >
        <el-input v-model="editForm.id" type="hidden"></el-input>

        <el-form-item label="标题" prop="rule">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="rule">
          <el-input v-model="editForm.content"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button
            @click.native="editSubmit"
            :loading="editLoading"
            type="primary"
          >
            提交
          </el-button>
        </div>
      </template>
    </el-dialog>
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
  title: Utils.siteTitle("话题")
})

let results = ref([])
let listLoading = ref(false)
let page = ref({})
let filters = ref({
  status: '0'
})

let editForm = ref({
  id: '',
  name: '',
  description: '',
  status: '',
  sortNo: '',
  createTime: '',
})
let editFormVisible = ref(false)
let editLoading = ref(false)
let editFormRules = ref({})
let editFormRef = ref(false)

const runtimeConfig = useRuntimeConfig()

const list = async () => {
  listLoading.value = true

  try {
    const params = Object.assign(filters.value, {
      page: page.value.page,
      limit: page.value.limit
    })

    let {data, status} = await useAdminApi().getTopics(params)
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

const handleEdit = async (index, row) => {
  let {data, status} = await useAdminApi().getEditTopics(row.id)
  if (status.value ==="success" && data.value.success) {
    editForm.value = Object.assign({}, data.value.data)
    editFormVisible.value = true
  }
}

const editSubmit = async () => {
  let {data, status} = await useAdminApi().editTopic(editForm.value.id, editForm.value)
  if (status.value ==="success" && data.value.success) {
    editFormVisible.value = false
    await list()
    ElMessage.info("编辑成功")
  } else {
    ElMessage.error("编辑失败")
  }
}

const deleteSubmit = async (row) => {
  ElMessageBox.confirm(
    '是否确认删除该话题？',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        let {data, status} = await useAdminApi().deleteTopic(row.id)
        if (status.value === "success" && data.value.success) {
          await list()
          ElMessage.success("删除成功")
        } else {
          ElMessage.success("删除失败")
        }
      } catch (err) {
        ElMessage.success("删除失败")
      }
    })
    .catch(() => {})
}

const undeleteSubmit = async (row) => {
  try {
    let {data, status} = await useAdminApi().undeleteTopic(row.id)
    if (status.value === "success" && data.value.success) {
      await list()
      ElMessage.success("取消删除成功")
    } else {
      ElMessage.success("取消删除失败")
    }
  } catch (err) {
    ElMessage.success("取消删除失败")
  }
}

const recommend = async (id) => {
  try {
    let {data, status} = await useAdminApi().recommendTopics(id)
    if (status.value === "success" && data.value.success) {
      await list()
      ElMessage.success("推荐成功")
    } else {
      ElMessage.success("推荐失败")
    }
  } catch (err) {
    ElMessage.success("推荐失败 222", err.message)
  }
}

const cancelRecommend = async (id) => {
  try {
    let {data, status} = await useAdminApi().cancleRecommendTopics(id)
    if (status.value === "success" && data.value.success) {
      await list()
      ElMessage.success("取消推荐成功")
    } else {
      ElMessage.success("取消推荐失败")
    }
  } catch (err) {
    ElMessage.success("取消推荐失败", err.message)
  }
}

</script>

<style scoped lang="scss">
.topics {
  display: table;

  .topic:not(:last-child) {
    border-bottom: solid 1px rgba(140, 147, 157, 0.14);
  }

  .topic {
    padding-top: 10px;
    padding-bottom: 10px;

    .topic-header {
      display: flex;

      .avatar {
        max-width: 50px;
        max-height: 50px;
        min-width: 50px;
        min-height: 50px;
        border-radius: 50%;
      }

      .topic-right {
        display: block;
        margin-left: 10px;

        .topic-title a {
          color: #555;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          text-decoration: none;
        }

        .topic-meta {
          margin-top: 8px;

          label:not(:last-child) {
            margin-right: 5px;
          }

          label {
            color: #999;
            font-size: 12px;
          }

          label.author {
            /*color: #dc2323;*/
            font-weight: bold;
          }

          label.node {
            color: #dc2323;
            font-weight: bold;
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

    .topic-footer {
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
