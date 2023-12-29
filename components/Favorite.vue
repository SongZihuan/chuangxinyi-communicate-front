<template>
  <el-card>
    <div v-if="item.deleted">
      <el-result
        title="收藏的内容被删除啦"
      >
      </el-result>
    </div>
    <div v-else>
      <div class="flex flex-row items-center">
        <div class="mr-2 flex flex-row items-center">
          <Avatar :user="item.user" />
        </div>
        <div class="mx-2">
          <div>
            <span class="title mr-2" @click="toObj">
              {{ item.title }}
            </span>

            <el-tag v-if="isTopic"> 话题 </el-tag>
            <el-tag v-else> 文章 </el-tag>
          </div>
          <div class="content">
            {{ item.content }}
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import Utils from "~/common/utils"

const props = defineProps({
  item: {
    type: Object,
    require: true
  }
})

let item = ref(props.item)

let isTopic = computed(()=>{
  return item.value.entityType === "topic"
})

let objId = computed(()=>{
  return item.value.entityId
})

let toObj = computed(()=>{
  if (isTopic.value) {
    Utils.linkTo("/topic/"+objId.value)
  } else {
    Utils.linkTo("/article/"+objId.value)
  }
})

</script>


<style scoped lang="scss">
.title {
  font-size: 30px;
}


</style>
