<template>
  <div v-if="user">
    <el-card class="mx-1 my-1">
      <div class="flex flex-row">
        <Avatar :user="user"/>
        <div class="flex flex-col mx-2 items-start">
          <el-link :href="'/user/' + user.id"> {{Utils.getUserName(user)}} </el-link>
          <el-text v-if="user.levelName"> {{ user.levelName }} </el-text>
        </div>
      </div>
      <div>
        <el-text>
          注册时间：{{ Utils.formatDate(user.createTime, 'YYYY-MM-DD') }}
        </el-text>
      </div>
      <div>
        <el-text>
          积分：{{ user.score }}
        </el-text>
      </div>
      <div>
        <el-text>
          帖子数：{{ user.topicCount }}
        </el-text>
      </div>
      <div>
        <el-text>
          回复数：{{ user.commentCount }}
        </el-text>
      </div>
      <div class="flex flex-col items-center mt-5 justify-stretch">
        <el-button-group>
          <el-button
            @click="toHomePage"
          >
            主页
          </el-button>


          <el-button
            @click="watch"
          >
            <span v-if="watched"> 取消关注 </span>
            <span v-else> 关注 </span>
          </el-button>

        </el-button-group>
      </div>

      <div class="flex flex-col items-center mt-5 justify-stretch">
        <el-button-group>
          <el-button
            v-if="isOwner"
            @click="Utils.linkTo('/user/scores')"
          >
            积分明细
          </el-button>
          <el-button
            v-if="isOwner"
            @click="toUserCenter"
          >
            编辑资料
          </el-button>
          <el-button
            v-if="isOwner"
            @click="Utils.linkTo('/user/notifications')"
          >
            动态
          </el-button>
          <el-button
            v-if="isOwner"
            @click="Utils.linkTo('/user/favorites')"
          >
            收藏
          </el-button>
        </el-button-group>
      </div>

    </el-card>
  </div>
</template>

<script setup lang="ts">
import Utils from "~/common/utils"
import { useAuthStore } from '~/store/auth'
import { useUserApi } from '~/api/user'
import { ElMessage } from 'element-plus'

const runtimeConfig = useRuntimeConfig()

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  modelValue: {
    type: Object,
  }
})


const emit = defineEmits(["update:modelValue"])

let user = ref(null)

let currentUser = computed(()=>{
  return useAuthStore().currentUser
})

let isOwner = computed(()=>{
  return user.value && currentUser.value && user.value.id === currentUser.value.id
})

const toUserCenter = () => {
  Utils.openTo(runtimeConfig.public.USER_CENTER)
}

const toHomePage = () => {
  Utils.openTo(runtimeConfig.public.HOME_PAGE + "?userID=" + user.value.uid)
}

const getUserProfile = async () => {
  let {data, status} = await useUserApi().profile(props.id)
  if (status.value === "success" && data.value.success) {
    user.value = data.value.data
    emit("update:modelValue", user.value)
  }
}

let watched = ref(false)
let userWatchers = ref({})

const getWatched = async () => {
  let {data, status} = await useUserApi().watched(props.id)
  if (status.value === "success" && data.value.success) {
    watched.value = data.value.data.watched || false
  } else {
    watched.value = false
  }
}

const getUserWatcher = async () => {
  let {data, status, error} = await useUserApi().recentwatchers(props.id)
  if (status.value === "success" && data.value.success) {
    userWatchers.value = data.value.data
  } else {
    console.log(status.value, error && error.value)
  }
}

await Promise.all([
  getUserProfile(),
  getWatched(),
  getUserWatcher(),
])

const watch = async () => {
  if (!currentUser) {
    ElMessage.success('请登录后再关注')
    return
  }

  if (watched.value) {
    let {data, status} = await useUserApi().deleteWatched(user.value.id)
    if (status.value ==="success" && data.value.success) {
      watched.value = false
      ElMessage.success('已取消关注！')
      await getUserWatcher()
    }
  } else {
    let {data, status} = await useUserApi().addWatched(user.value.id)
    if (status.value ==="success" && data.value.success) {
      watched.value = true
      ElMessage.success('关注成功！')
      await getUserWatcher()
    }
  }
}

</script>

<style lang="scss" scoped>
.user-info-component {
  display: flex;

  .user-info-component-right {
    margin-left: 5px;
    padding: 3px 0;

    font-weight: 700;
    font-size: 15px;
  }
}
</style>
