<template>
  <div class="flex flex-row justify-center items-center mt-5">
    <el-result
      icon="error"
    >
      <template #icon>
        <div class="xxx">
          <SvgIcon name="notfound" :w="500" :h="500"></SvgIcon>
        </div>
      </template>
      <template #title>
        <span>
          你来到了一篇知识的荒漠！
        </span>
      </template>
      <template #sub-title>
        <span v-if="props.error.statusCode === 404">
          {{
            props.error.message ? props.error.message : '页面没找到'
          }}
        </span>
        <span v-if="props.error.statusCode === 403">
          {{
            props.error.message ? props.error.message : '不允许访问'
          }}
        </span>
        <span v-else-if="runtimeConfig.public.ENV === 'development'">
          {{ props.error.message ? props.error.message : '页面错误' }}
        </span>
        <span v-else>
          页面错误
        </span>
      </template>
      <template #extra>
        <el-button type="primary" @click="Utils.linkTo('/')">回到主页</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
import Utils from "~/common/utils"

const props = defineProps({
  error: {
    type: Object,
    default: null,
  }
})

const runtimeConfig = useRuntimeConfig()

if (runtimeConfig.public.ENV !== "development" && props.error.statusCode >= 500) {
  setTimeout(async ()=>{
    await Utils.linkTo('/')
  }, 1000)
}

</script>

<style lang="scss" scoped>
.error {
  background: #fff;
  text-align: center;
  vertical-align: center;
  padding: 100px 0;

  .description {
    margin-top: 30px;
    span {
      font-size: 18px;
      font-weight: bold;
      line-height: 22px;
      color: rgb(230, 76, 76);
    }
  }
}
</style>
