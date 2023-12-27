<template>
  <section v-loading="loading" class="page-container">
    <el-tabs v-model="tabValue">
      <el-tab-pane label="通用配置" name="commonConfigTab">
        <div class="config">
          <el-form label-width="160px">
            <el-form-item label="网站名称">
              <el-input
                v-model="config.siteTitle"
                type="text"
                placeholder="网站名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="网站描述">
              <el-input
                v-model="config.siteDescription"
                type="textarea"
                autosize
                placeholder="网站描述"
              ></el-input>
            </el-form-item>
            <el-form-item label="网站关键字">
              <el-select
                v-model="config.siteKeywords"
                style="width:100%"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="网站关键字"
              ></el-select>
            </el-form-item>

            <el-form-item label="网站公告">
              <el-input
                v-model="config.siteNotification"
                type="textarea"
                placeholder="网站公告（支持输入HTML）"
              ></el-input>
            </el-form-item>
            <el-form-item label="推荐标签">
              <el-select
                v-model="config.recommendTags"
                style="width:100%"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="推荐标签"
              ></el-select>
            </el-form-item>
            <el-form-item label="默认节点">
              <el-select
                v-model="config.defaultNodeId"
                style="width:100%"
                placeholder="发帖默认节点"
              >
                <el-option
                  v-for="node in nodes.results"
                  :key="node.id"
                  :label="node.name"
                  :value="node.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="小贴士" name="tipConfigTab" class="tip-panel">
        <draggable
          v-model="config.siteTips"
          draggable=".tip"
          itemKey="id"
          handle=".tip-sort-btn"
          class="tips"
        >
          <template #item="{element, index}">
            <el-row :gutter="20">
              <el-col :span="1">
                <i class="iconfont icon-sort tip-sort-btn" />
              </el-col>
              <el-col :span="5">
                <el-input
                  v-model="element.title"
                  type="text"
                  size="small"
                  placeholder="标题"
                ></el-input>
              </el-col>
              <el-col :span="10">
                <el-input
                  v-model="element.content"
                  type="textarea"
                  size="small"
                  placeholder="内容"
                ></el-input>
              </el-col>
              <el-col :span="2">
                <el-button
                  @click="delTip(index)"
                  type="danger"
                  size="small"
                >
                  删除
                </el-button>
              </el-col>
            </el-row>
          </template>
        </draggable>
        <div class="add-tip">
            <el-button
              @click="addTip"
              type="primary"
            >
              新增
            </el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="导航配置" name="navConfigTab" class="nav-panel">
        <draggable
          v-model="config.siteNavs"
          itemKey="id"
        >
          <template #item="{element, index}">
            <el-row :gutter="20">
              <el-col :span="1">
                <i class="iconfont icon-sort nav-sort-btn" />
              </el-col>
              <el-col :span="10">
                <el-input
                  v-model="element.title"
                  type="text"
                  size="small"
                  placeholder="标题"
                ></el-input>
              </el-col>
              <el-col :span="11">
                <el-input
                  v-model="element.url"
                  type="text"
                  size="small"
                  placeholder="链接"
                ></el-input>
              </el-col>
              <el-col :span="2">
                <el-button
                  @click="delNav(index)"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  size="small"
                ></el-button>
              </el-col>
            </el-row>
          </template>
        </draggable>
        <div class="add-nav">
          <el-tooltip
            class="item"
            effect="dark"
            content="点击按钮添加导航"
            placement="top"
          >
            <el-button
              @click="addNav"
              type="primary"
              icon="el-icon-plus"
              circle
            ></el-button>
          </el-tooltip>
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-if="config.scoreConfig"
        label="积分配置"
        name="scoreConfigTab"
      >
        <el-form label-width="160px">
          <el-form-item label="发帖获得积分">
            <el-input-number
              v-model="config.scoreConfig.postTopicScore"
              :min="1"
              type="text"
              placeholder="发帖获得积分"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="跟帖获得积分">
            <el-input-number
              v-model="config.scoreConfig.postCommentScore"
              :min="1"
              type="text"
              placeholder="跟帖获得积分"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="页面定制" name="customConfigTab">
        <div class="config">
          <el-form label-width="160px">
            <el-form-item label="首页首屏HTML">
              <el-input
                v-model="config.siteIndexHtml"
                type="textarea"
                rows="6"
                placeholder="首页首屏（支持输入HTML）"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div style="margin-top: 20px;">
      <el-button :loading="loading" @click="save" type="primary"
        >保存</el-button
      >
    </div>
  </section>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
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
  title: Utils.siteTitle("设置")
})

let config = ref({})
let loading = ref(false)
let nodes = ref([])
let tabValue = ref("commonConfigTab")

const loadSetting = async () => {
  let {data, status} = await useAdminApi().getSetting()
  if (status.value === "success" && data.value.success) {
    config.value = data.value.data
  }
}

const loadNode = async () => {
  let {data, status} = await useAdminApi().getNodes()
  if (status.value === "success" && data.value.success) {
    nodes.value = data.value.data
  }
}

const load = async () => {
  loading.value = true
  try{
    await Promise.all([
      loadSetting(),
      loadNode(),
    ])
  } finally {
    loading.value = false
  }
}

await load()

const save = async () => {
  loading.value = true

  try{
    let {data, status} = await useAdminApi().saveSetting(config.value)
    if (status.value === "success" && data.value.success) {
      ElMessage.success("提交成功")
      await load()
    }
  } finally {
    loading.value = false
  }
}

const addTip = () => {
  console.log("AAA")
  if (!config.value.siteTips) {
    config.value.siteTips = []
  }
  config.value.siteTips.push({
    title: '小帖士',
    content: ''
  })
  console.log("BBB", config.value.siteTips)
}

const delTip = (index) => {
  if (!config.value.siteTips) {
    return
  }
  config.value.siteTips.splice(index, 1)
}

const addNav = () => {
  if (!config.value.siteNavs) {
    config.value.siteNavs = []
  }
  config.value.siteNavs.push({
    title: '',
    url: ''
  })
}

const delNav = (index) => {
  if (!config.value.siteNavs) {
    return
  }
  config.value.siteNavs.splice(index, 1)
}
</script>

<style scoped lang="scss">
.config {
  padding: 10px 0;
}
.tip-panel {
  .tips {
    border: 1px solid #ddd;
    border-radius: 5px;
    .tip {
      padding: 5px 5px;
      margin: 0;

      &:not(:last-child) {
        border-bottom: 1px solid #ddd;
      }

      .tip-sort-btn {
        font-size: 21px;
        font-weight: 700;
        cursor: pointer;
        float: right;
      }
    }
  }

  .add-tip {
    margin-top: 20px;
    text-align: center;
  }
}
.nav-panel {
  .navs {
    border: 1px solid #ddd;
    border-radius: 5px;
    .nav {
      padding: 5px 5px;
      margin: 0;

      &:not(:last-child) {
        border-bottom: 1px solid #ddd;
      }

      .nav-sort-btn {
        font-size: 21px;
        font-weight: 700;
        cursor: pointer;
        float: right;
      }
    }
  }

  .add-nav {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
