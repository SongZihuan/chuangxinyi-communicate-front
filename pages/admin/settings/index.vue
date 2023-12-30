<template>
  <div v-loading="loading" class="page-container">
    <el-tabs v-model="tabValue">
      <el-tab-pane label="通用配置" name="commonConfigTab">
        <div class="flex flex-col justify-start">
          <el-form label-width="100px">
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
        >
          <template #item="{element, index}">
            <div class="flex flex-row justify-start items-center">
              <el-input
                v-model="element.title"
                type="text"
                placeholder="标题"
                class="w-[40%] m-2"
              />
              <el-input
                v-model="element.content"
                type="textarea"
                placeholder="内容"
                class="w-[40%] m-2"
              />
              <el-button
                @click="delTip(index)"
                type="danger"
                size="small"
                class="m-2"
              >
                删除
              </el-button>
            </div>
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
        >
          <template #item="{element, index}">
            <div class="flex flex-row justify-start items-center">
              <el-input
                v-model="element.title"
                type="text"
                placeholder="标题"
                class="w-[40%] m-2"
              ></el-input>
              <el-input
                v-model="element.url"
                type="text"
                placeholder="链接"
                class="w-[40%] m-2"
              ></el-input>
              <el-button
                @click="delNav(index)"
                type="danger"
                class="m-2"
              >删除</el-button>
            </div>
          </template>
        </draggable>
        <div class="add-nav">
          <el-button
            @click="addNav"
            type="primary"
          >
            新增
          </el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-if="config.scoreConfig"
        label="积分配置"
        name="scoreConfigTab"
      >
        <el-form label-width="100px">
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
      <el-tab-pane label="底部信息" name="footerTab">
        <el-form label-width="100px">
          <el-form-item label="ICP备案号">
            <el-input
              v-model="config.footerConfig.icp"
              type="text"
            />
          </el-form-item>
          <el-form-item label="公安备案号">
            <el-input
              v-model="config.footerConfig.gongan"
              type="text"
            />
          </el-form-item>
          <el-form-item label="版权信息">
            <el-input
              v-model="config.footerConfig.copyright"
              type="text"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <div class="flex flex-col items-end my-2">
      <el-button :loading="loading" @click="save" type="primary">
        保存
      </el-button>
    </div>
  </div>
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
  if (!config.value.siteTips) {
    config.value.siteTips = []
  }
  config.value.siteTips.push({
    title: '小帖士',
    content: ''
  })
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
