<template>
  <section class="flex flex-col my-2">
    <div class="flex flex-row my-2">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.userId" placeholder="用户编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-on:click="list" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :data="results"
      v-loading="listLoading"
      highlight-current-row
      border
      style="width: 100%;"
    >
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="userId" label="用户">
        <template v-slot="scope">
          <el-popover
            placement="top-start"
            :width="400"
            trigger="click"
          >
            <template #reference>
              {{ Utils.getUserName(scope.row.user) }}
            </template>
            <UserInfo :id="scope.row.user.id" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="积分"></el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template v-slot="scope">{{
            Utils.formatDate(scope.row.createTime)
        }}</template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间">
        <template v-slot="scope">{{
            Utils.formatDate(scope.row.updateTime)
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template v-slot="scope">
          <el-button
            @click="showLog(scope.$index, scope.row)"
            type="success"
            size="small"
            >积分记录</el-button
          >
        </template>
      </el-table-column>
    </el-table>

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
    <AdminScoreLog ref="scoreLogRef" />
  </section>
</template>

<script setup lang="ts">
import { useAdminApi } from '~/api/admin'
import Utils from '~/common/utils'

definePageMeta({
  layout: "admin",
  middleware: [
    'authenticated',
  ],
})

useHead({
  title: Utils.siteTitle("积分")
})


let results = ref([])
let listLoading = ref(false)
let page = ref({})
let filters = ref({})
let scoreLogRef = ref({})

const list = async () => {
  listLoading.value = true

  try {
    const params = Object.assign(filters.value, {
      page: page.value.page,
      limit: page.value.limit
    })

    let {data, status} = await useAdminApi().getUserScore(params)
    if (status.value === "success" && data.value.success) {
      results.value = data.value.data.results
      page.value = data.value.data.page
    }
  } finally {
    listLoading.value = false
  }
}

await list()

const showLog = async (index, row) => {
  console.log(scoreLogRef.value)
  await scoreLogRef.value.showLog(row.userId)
}

const handlePageChange = async (val) => {
  page.value.page = val
  await list()
}

const handleLimitChange = async (val) => {
  page.value.limit = val
  await list()
}
</script>

<style lang="scss" scoped></style>
