<template>
  <div class="flex flex-row w-[100%]">
    <div class="flex flex-col w-[70%]">
      <div class="mr-2">
        <div class="my-2">
          <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/user/' + currentUser.id, query: {'tab': 'topics'}}">{{ currentUserName }}</el-breadcrumb-item>
            <el-breadcrumb-item > 积分记录 </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div>
          <ScoreLog
            v-for="(log, index) in scoreLogsPage.results"
            :key="index"
            :score-log="log"
            class="my-2"
          />
        </div>
        <Pagination @change="onChange" :page="scoreLogsPage.paging"/>
      </div>
    </div>
    <div class="flex flex-col w-[30%]">
      <div class="ml-2">
        <UserInfo :id="currentUser.id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Pagination from '~/components/Pagination'
import { useUserApi } from '~/api/user'
import { useAuthStore } from '~/store/auth'
import Utils from '~/common/utils'
import { ArrowRight } from '@element-plus/icons-vue'

const route = useRoute()
let page = ref(route.query.p || 1)

definePageMeta({
  middleware: [
    'authenticated'
  ],
})

let scoreLogsPage = ref({})
let currentUser = useAuthStore().currentUser
let currentUserName = useAuthStore().currentUserName

const getScoreLog = async () => {
  let {data, status, error} = await useUserApi().scoreLog(page.value)
  if (status.value === "success" && data.value.success) {
    scoreLogsPage.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

await Promise.all([
  getScoreLog(),
])

useHead({
  title: Utils.siteTitle("积分"),
})

const onChange = async (newPage: number) => {
  page.value = newPage
  await getScoreLog()
}

</script>

<style lang="scss" scoped>
.score-logs {
  // margin-top: 10px;
  font-size: 1rem;
  li {
    line-height: 2;

    .score-type {
      color: green;
    }

    .score-score {
      span {
        font-weight: bold;
      }
    }

    .score-time {
      color: #777;
    }

    .score-description {
      color: #777;
    }

    &.plus {
      .score-type {
        color: red;
      }
    }
  }
}
</style>
