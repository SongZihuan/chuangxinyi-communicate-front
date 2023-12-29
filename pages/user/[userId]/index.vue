<template>
  <div class="flex flex-row w-[100%]">
    <div class="flex flex-col w-[70%]">
      <div class="mr-2">
        <div class="my-2">
          <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/user/' + user.id, query: {'tab': 'topics'}}">{{ Utils.getUserName(user) }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <UserCenter :user-id="Number(userId)" />
      </div>
    </div>
    <div class="flex flex-col w-[30%]">
      <UserInfo v-model="user" :id="Number(userId)" />
      <UserWatcher :id="Number(userId)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Utils from '~/common/utils'
import { useUserApi } from '~/api/user'
import { ArrowRight } from '@element-plus/icons-vue'

const defaultTab = 'topics'
const route = useRoute()
const userId = route.params.userId

const activeTab = ref(route.query.tab || defaultTab)
let recentTopics = ref({})
let recentArticles = ref({})

let user = ref({})

const getRecent = async ()=> {
  if (activeTab.value === 'topics') {
    let {data, status} = await useUserApi().topicesRecent(userId)
    if (status.value ==="success" && data.value.success) {
      recentTopics.value = data.value.data
    }
  } else if (activeTab.value  === 'articles') {
    let {data, status} = await useUserApi().articleRecent(userId)
    if (status.value ==="success" && data.value.success) {
      recentArticles.value = data.value.data
    }
  }
}

await getRecent()

useHead({
  title: Utils.siteTitle(Utils.getUserName(user)),
})

</script>

<style lang="scss" scoped>
.tabs {
  margin-bottom: 5px;
}
.more {
  text-align: right;
}
.watch-actions {
  display: flex;
  height: 42px;
  width: max-content;
  padding: 5px 10px 5px 5px;

  background: #fff;
  // border: 1px solid #dae0e4;
  border-radius: 30px;
  vertical-align: middle;

  .avatar {
    margin-left: 5px;
    border: solid 1px #e8ecee;
  }

  .split {
    display: inline-block;
    margin: auto 7px auto 10px;
    height: 16px;
    width: 1px;
    opacity: 0.4;
    background: #dae0e4;
    vertical-align: middle;
  }

  .action {
    margin-left: 5px;
    height: 30px;
    width: 30px;
    line-height: 30px;
    text-align: center;
    color: #e7672e;
    background-color: rgba(126, 107, 1, 0.08);
    border-radius: 50%;
    transition: all 0.5s;
    cursor: pointer;

    i {
      font-size: 16px;
    }

    &:hover,
    &.active {
      color: #fff;
      background-color: #e7672e;
    }
  }
}
</style>
