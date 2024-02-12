<template>
  <div class="flex flex-col my-2">
    <div class="flex flex-row my-2">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.id" placeholder="编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-on:click="list" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
      <el-form-item>
        <el-button @click="handleAdd" type="primary">新增</el-button>
      </el-form-item>
    </div>

    <el-table
      :data="results"
      v-loading="listLoading"
      @selection-change="handleSelectionChange"
      highlight-current-row
      border
      style="width: 100%"
      class="my-2"
    >
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="sortNo" label="排序"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag>
            {{ scope.row.status === 0 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template #default="scope">
          {{ Utils.formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button @click="handleEdit(scope.$index, scope.row)" size="small"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>

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

    <client-only>
      <el-dialog
        v-model="addFormVisible"
        :close-on-click-modal="false"
        title="新增"
        destroy-on-close
        draggable
      >
        <el-form :model="addForm" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="addForm.description"
              type="textarea"
              auto-complete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="addForm.sortNo"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button
              @click.native="addSubmit"
              type="primary"
            >提交</el-button
            >
          </div>
        </template>
      </el-dialog>

      <el-dialog
        v-model="editFormVisible"
        :close-on-click-modal="false"
        title="编辑"
        destroy-on-close
        draggable
      >
        <el-form :model="editForm" label-width="80px">
          <el-input v-model="editForm.id" type="hidden"></el-input>
          <el-form-item label="名称">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="editForm.description"
              type="textarea"
              auto-complete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="editForm.sortNo"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="editForm.status"
              clearable
              placeholder="请选择状态"
            >
              <el-option :value="0" label="启用"></el-option>
              <el-option :value="1" label="禁用"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click.native="editFormVisible = false">取消</el-button>
            <el-button
              @click.native="editSubmit"
              type="primary"
              >提交</el-button
            >
          </div>
        </template>
      </el-dialog>
    </client-only>
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
  title: Utils.siteTitle("节点")
})

let results = ref([])
let listLoading = ref(false)
let page = ref({})
let filters = ref({})
let selectedRows = ref({})

let addForm = ref({
  name: '',
  description: '',
  status: '',
  sortNo: '',
  createTime: '',
})
let addFormVisible = ref(false)

let editForm = ref({
  id: '',
  name: '',
  description: '',
  status: '',
  sortNo: '',
  createTime: '',
})
let editFormVisible = ref(false)

const list = async () => {
  listLoading.value = true

  try {
    const params = Object.assign(filters.value, {
      page: page.value.page,
      limit: page.value.limit,
    })

    let {data, status} = await useAdminApi().getNodes(params)
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
const handleAdd = () => {
  addForm.value = {
    name: '',
    description: '',
  }
  addFormVisible.value = true
}
const addSubmit = async () => {
  let {data, status} = await useAdminApi().addNode(addForm.value)
  if (status.value === "success" && data.value.success) {
    ElMessage.success("提交成功")
    addFormVisible.value = false
    await list()
  }
}
const handleEdit = async (index, row) => {
  let {data, status} = await useAdminApi().getEditNode(row.id)
  if (status.value ==="success" && data.value.success) {
    editForm.value = Object.assign({}, data.value.data)
    editFormVisible.value = true
  }
}
const editSubmit = async () => {
  let {data, status} = await useAdminApi().editNode(editForm.value.id, editForm.value)
  if (status.value ==="success" && data.value.success) {
    editFormVisible.value = false
    await list()
    ElMessage.success("编辑成功")
  }
}

const handleSelectionChange = (val) => {
  selectedRows.value = val
}

</script>

<style lang="scss"></style>
