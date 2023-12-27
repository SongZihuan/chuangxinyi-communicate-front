<template>
  <section class="page-container">
    <div class="toolbar">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.title" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.url" placeholder="链接"></el-input>
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
            <el-option label="待审" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-on:click="list" type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleAdd" type="primary">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :data="results"
      v-loading="listLoading"
      highlight-current-row
      stripe
      style="width: 100%;"
    >
      <el-table-column prop="id" label="编号" width="100"></el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="url" label="链接">
        <template v-slot="scope">
          <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="logo" label="Logo" width="60">
        <template v-slot="scope">
          <img v-if="scope.row.logo" :src="scope.row.logo" class="link-logo" />
        </template>
      </el-table-column>
      <el-table-column prop="summary" label="描述"></el-table-column>
      <el-table-column prop="status" label="状态" width="50">
        <template v-slot="scope"
          >{{ scope.row.status === 0 ? '正常' : '删除' }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template v-slot="scope"
          >{{ Utils.formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template v-slot="scope">
          <el-button @click="handleEdit(scope.$index, scope.row)" size="small"
            >编辑
          </el-button>
          <el-button @click="deleteSubmit(scope.row)" type="danger" size="small"
            >删除
          </el-button>
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
      ></el-pagination>
    </div>

    <el-dialog
      v-model="addFormVisible"
      :close-on-click-modal="false"
      title="新增"
    >
      <el-form :model="addForm" label-width="80px">
        <el-form-item label="链接">
          <el-input v-model="addForm.url" style="width: 80%;"></el-input>&nbsp;
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="addForm.summary"
            :autosize="{ minRows: 2, maxRows: 4 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="Logo">
          <el-input v-model="addForm.logo"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="addForm.status" placeholder="请选择">
            <el-option :key="0" :value="0" label="正常"></el-option>
            <el-option :key="1" :value="1" label="删除"></el-option>
            <el-option :key="2" :value="2" label="待审"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button
            @click.native="addSubmit"
            :loading="addLoading"
            type="primary"
          >提交
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="editFormVisible"
      :close-on-click-modal="false"
      title="编辑"
    >
      <el-form
        :model="editForm"
        label-width="80px"
      >
        <el-input v-model="editForm.id" type="hidden"></el-input>
        <el-form-item label="链接">
          <el-input v-model="editForm.url"></el-input>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="editForm.summary"
            :autosize="{ minRows: 2, maxRows: 4 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="Logo">
          <el-input v-model="editForm.logo"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择">
            <el-option :key="0" :value="0" label="正常"></el-option>
            <el-option :key="1" :value="1" label="删除"></el-option>
            <el-option :key="2" :value="2" label="待审"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button
            @click.native="editSubmit"
            :loading="editLoading"
            type="primary"
          >提交
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
  title: Utils.siteTitle("友链")
})

let results = ref([])
let listLoading = ref(false)
let page = ref({})
let filters = ref({})

let addForm = ref({
  url: '',
  title: '',
  summary: ''
})
let addFormVisible = ref(false)
let addLoading = ref(false)

let editForm = ref({})
let editFormVisible = ref(false)
let editLoading = ref(false)

const list = async () => {
  listLoading.value = true

  try {
    const params = Object.assign(filters.value, {
      page: page.value.page,
      limit: page.value.limit,
    })

    let {data, status} = await useAdminApi().getLink(params)
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
  addForm.value = {}
  addFormVisible.value = true
}

const addSubmit = async () => {
  let {data, status} = await useAdminApi().addLinks(addForm.value)
  if (status.value === "success" && data.value.success) {
    ElMessage.success("提交成功")
    addFormVisible.value = false
    await list()
  }
}

const handleEdit = async (index, row) => {
  let {data, status} = await useAdminApi().getEditLink(row.id)
  if (status.value ==="success" && data.value.success) {
    editForm.value = Object.assign({}, data.value.data)
    editFormVisible.value = true
  }
}

const editSubmit = async () => {
  let {data, status} = await useAdminApi().editLink(editForm.value.id, editForm.value)
  if (status.value ==="success" && data.value.success) {
    editFormVisible.value = false
    await list()
    ElMessage.success("编辑成功")
  }
}

const deleteSubmit = async (row) => {
  ElMessageBox.confirm(
    '是否确认删除该链接？',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      let {data, status} = await useAdminApi().deleteLink(row.id)
      if (status.value === "success" && data.value.success) {
        await list()
        ElMessage.success("删除成功")
      }
    })
    .catch(() => {})
}
</script>

<style scoped>
.link-logo {
  max-width: 50px;
  max-height: 50px;
}
</style>
