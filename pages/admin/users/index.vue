<template>
  <section class="page-container">
    <div class="toolbar">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.id" placeholder="编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.nickname" placeholder="昵称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-on:click="list" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :data="results"
      v-loading="listLoading"
      @selection-change="handleSelectionChange"
      highlight-current-row
      stripe
      style="width: 100%;"
    >
      <el-table-column type="expand">
        <template v-slot="scope">
          <div
            v-if="scope.row.roles && scope.row.roles.length"
            class="content-form"
          >
            <div class="form-item">
              <div class="field-key">角色：</div>
              <div class="field-value">
                <el-tag
                  v-for="role in scope.row.roles"
                  :key="role"
                  size="mini"
                  style="margin-right:3px;"
                  >{{ role }}
                </el-tag>
              </div>
            </div>
          </div>
          <div class="content-form">
            <div class="form-item">
              <span class="field-key">状态：</span>
              <span class="field-value">
                {{ scope.row.status === 0 ? '正常' : '删除' }}
              </span>
            </div>
          </div>
          <div class="content-form">
            <div class="form-item">
              <span class="field-key">创建时间：</span>
              <span class="field-value">
                {{ Utils.formatDate(scope.row.createTime) }}
              </span>
            </div>
          </div>
          <div class="content-form">
            <div class="form-item">
              <span class="field-key">更新时间：</span>
              <span class="field-value">
                {{ Utils.formatDate(scope.row.updateTime) }}
              </span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="编号" width="100"></el-table-column>
      <el-table-column prop="avatar" label="头像" width="80">
        <template v-slot="scope">
          <img
            :src="runtimeConfig.public.AVATAR_URL + '?uid=' + scope.row.uid"
            style="max-height: 50px; max-width: 50px; border-radius: 50%;"
          />
        </template>
      </el-table-column>
      <el-table-column prop="uid" label="标识符"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="nickname" label="昵称"></el-table-column>
      <el-table-column prop="score" label="积分"></el-table-column>
      <el-table-column prop="createTime" label="角色">
        <template v-slot="scope">{{
          scope.row.level === 10 ? '管理员' : '普通用户'
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template v-slot="scope">
          <el-button @click="handleEdit(scope.$index, scope.row)" size="small"
            >编辑</el-button
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

    <el-dialog
      v-model="editFormVisible"
      :close-on-click-modal="false"
      title="编辑"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
      >
        <el-input v-model="editForm.id" type="hidden"></el-input>
        <el-form-item label="角色" prop="level">
          <el-select v-model="editForm.level" placeholder="请选择">
            <el-option :key="0" :value="0" label="普通用户"></el-option>
            <el-option :key="1" :value="10" label="管理员"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="editForm.status" placeholder="请选择">
            <el-option :key="0" :value="0" label="正常"></el-option>
            <el-option :key="1" :value="1" label="删除"></el-option>
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
          >提交</el-button
          >
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
  title: Utils.siteTitle("用户")
})

let results = ref([])
let listLoading = ref(false)
let page = ref({})
let filters = ref({
  status: '0'
})

let editForm = ref({
  id: ''
})
let editFormVisible = ref(false)
let editLoading = ref(false)
let editFormRules = ref({})

const runtimeConfig = useRuntimeConfig()

const list = async () => {
  listLoading.value = true

  try {
    const params = Object.assign(filters.value, {
      page: page.value.page,
      limit: page.value.limit
    })

    let {data, status} = await useAdminApi().getUser(params)
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
  let {data, status} = await useAdminApi().getEditUser(row.id)
  if (status.value ==="success" && data.value.success) {
    editForm.value = Object.assign({}, data.value.data)
    editFormVisible.value = true
  }
}

const editSubmit = async  () => {
  let {data, status} = await useAdminApi().editUser(editForm.value.id, editForm.value)
  if (status.value ==="success" && data.value.success) {
    editFormVisible.value = false
    await list()
    ElMessage.success("编辑成功")
  }
}
</script>

<style scoped></style>
