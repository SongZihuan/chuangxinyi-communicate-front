<template>
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
        注册时间：{{ Utils.formatDate(user.createTime, 'yyyy-MM-dd') }}
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
  </el-card>
</template>

<script setup lang="ts">
import Utils from "~/common/utils"
const runtimeConfig = useRuntimeConfig()

const props = defineProps({
  user: {
    type: Object,
    required: true,
    default() {
      return null
    }
  }
})

let user = ref(props.user)
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
