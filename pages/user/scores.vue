<template>
  <section class="main">
    <div class="container main-container is-white left-main">
      <div class="left-container">
        <div class="widget">
          <div class="widget-header">积分记录</div>
          <div class="widget-content">
            <ul class="score-logs">
              <li
                v-for="scoreLog in scoreLogsPage.results"
                :key="scoreLog.id"
                :class="{ plus: scoreLog.type === 0 }"
              >
                <span class="score-type">{{
                  scoreLog.type === 0 ? '获得积分' : '减少积分'
                }}</span>
                <span class="score-score"
                  ><i class="iconfont icon-dollar" /><span>{{
                    scoreLog.score
                  }}</span></span
                >
                <span class="score-description">{{
                  scoreLog.description
                }}</span>
                <span class="score-time"
                  >@{{ Utils.formatDate(scoreLog.createTime) }}</span
                >
              </li>
            </ul>
            <pagination
              :page="scoreLogsPage.page"
              url-prefix="/user/scores?p="
            />
          </div>
        </div>
      </div>
      <div class="right-container">
        <UserInfo :user="currentUser" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Pagination from '~/components/Pagination'
import { useUserApi } from '~/api/user'
import { useAuthStore } from '~/store/auth'
import Utils from '~/common/utils'

const route = useRoute()
const page = route.query.p || 1

definePageMeta({
  middleware: [
    'authenticated'
  ],
})

let scoreLogsPage = ref({})
let currentUser = useAuthStore().currentUser

const getScoreLog = async () => {
  let {data, status, error} = await useUserApi().scoreLog(page)
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
