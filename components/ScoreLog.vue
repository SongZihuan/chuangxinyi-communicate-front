<template>
  <el-dialog
    v-model="isShowLog"
    v-if="isShowLog"
    width="80%"
    title="积分记录"
  >
    <el-table
      :data="results"
      v-loading="listLoading"
      highlight-current-row
      border
    >
      <el-table-column prop="id" label="编号"></el-table-column>
      <!-- <el-table-column prop="userId" label="用户编号"></el-table-column> -->
      <el-table-column prop="sourceType" label="来源类型"></el-table-column>
      <el-table-column prop="sourceId" label="来源编号"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="type" label="类型">
        <template v-slot="scope">{{
          scope.row.type === 0 ? '增加' : '减少'
        }}</template>
      </el-table-column>
      <el-table-column prop="score" label="积分"></el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template v-slot="scope">{{
            Utils.formatDate(scope.row.createTime)
        }}</template>
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
  </el-dialog>
</template>

<script setup lang="ts">
import { useAdminApi } from '~/api/admin'
import Utils from "~/common/utils"

let isShowLog = ref(false)
let userId = ref(0)
let results = ref([])
let listLoading = ref(false)
let page = ref({})
let filters = ref({
  status: '0'
})

let showLog = async (id) => {
  userId.value = id
  isShowLog.value = true
  await list()
}

let list = async () => {
  listLoading.value = true

  try {
    const params = Object.assign(filters.value, {
      page: page.value.page,
      limit: page.value.limit
    })

    let {data, status} = await useAdminApi().getUserScoreLogs(params, userId.value)
    if (status.value === "success" && data.value.success) {
      results.value = data.value.data.results
      page.value = data.value.data.page
    }
  } finally {
    listLoading.value = false
  }
}

const handlePageChange = async (val) => {
  page.value.page = val
  await list()
}

const handleLimitChange = async (val) => {
  page.value.limit = val
  await list()
}

defineExpose({
  showLog
})

</script>

<style lang="scss" scoped></style>
