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
        <el-form-item>
          <el-button @click="handleAdd" type="primary">新增</el-button>
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
        <template slot-scope="scope">
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
              <div class="field-key">状态：</div>
              <div class="field-value">
                {{ scope.row.status === 0 ? '正常' : '删除' }}
              </div>
            </div>
          </div>
          <div class="content-form">
            <div class="form-item">
              <div class="field-key">创建时间：</div>
              <div class="field-value">
                {{ scope.row.createTime | formatDate }}
              </div>
            </div>
          </div>
          <div class="content-form">
            <div class="form-item">
              <div class="field-key">更新时间：</div>
              <div class="field-value">
                {{ scope.row.updateTime | formatDate }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="编号" width="100"></el-table-column>
      <el-table-column prop="avatar" label="头像" width="80">
        <template slot-scope="scope">
          <img
            :src="scope.row.avatar"
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
        <template slot-scope="scope">{{
          scope.row.level === 10 ? '管理员' : '普通用户'
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
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
      :visible.sync="editFormVisible"
      :close-on-click-modal="false"
      title="编辑"
    >
      <el-form
        ref="editForm"
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
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button
          @click.native="editSubmit"
          :loading="editLoading"
          type="primary"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </section>
</template>

<script>
export default {
  layout: 'admin',
  data() {
    return {
      results: [],
      listLoading: false,
      page: {},
      filters: {
        id: ''
      },
      selectedRows: [],

      editForm: {
        id: '',
        roles: [],
        status: ''
      },
      editFormVisible: false,
      editFormRules: {},
      editLoading: false
    }
  },
  mounted() {
    this.list()
  },
  methods: {
    list() {
      const me = this
      me.listLoading = true
      const params = {}
      params.params = Object.assign(me.filters, {
        page: me.page.page,
        limit: me.page.limit
      })
      this.$axios
        .get('/api/admin/users', params)
        .then((data) => {
          me.results = data.results
          me.page = data.page
        })
        .finally(() => {
          me.listLoading = false
        })
    },
    handlePageChange(val) {
      this.page.page = val
      this.list()
    },
    handleLimitChange(val) {
      this.page.limit = val
      this.list()
    },
    handleEdit(index, row) {
      const me = this
      this.$axios
        .get(`/api/admin/users/${row.id}`)
        .then((data) => {
          me.editForm = Object.assign({}, data)
          me.editForm.password = ''
          me.editFormVisible = true
        })
        .catch((rsp) => {
          me.$notify.error({ title: '错误', message: rsp.message })
        })
    },
    editSubmit() {
      const me = this
      this.$axios
        .put('/api/admin/users/' + me.editForm.id, me.editForm)
        .then(() => {
          me.list()
          me.editFormVisible = false
        })
        .catch((rsp) => {
          me.$notify.error({ title: '错误', message: rsp.message })
        })
    },

    handleSelectionChange(val) {
      this.selectedRows = val
    }
  }
}
</script>

<style scoped></style>
