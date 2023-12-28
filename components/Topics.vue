<template>
  <div class="flex justify-center w-[100%]">
    <el-tabs v-model="currentTab" class="w-[95%]" stretch>
      <el-tab-pane label="默认" name="default">
        <TopicDefaulttList :page="page" />
        <template #label>
          <span class="nav-item">
            默认
          </span>
        </template>
      </el-tab-pane>
      <el-tab-pane label="精华帖" name="excellent">
        <TopicExcellentList :page="page" />
        <template #label>
          <span class="nav-item">
            精华帖
          </span>
        </template>
      </el-tab-pane>
      <el-tab-pane label="无人问津" name="noreply">
        <TopicNoReplyList :page="page" />
        <template #label>
          <span class="nav-item">
            无人问津
          </span>
        </template>
      </el-tab-pane>
      <el-tab-pane label="最新发布" name="new">
        <TopicNewList :page="page" />
        <template #label>
          <span class="nav-item">
            最新发布
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
  import TopicNoReplyList from '~/components/TopicNoReplyList.vue'
  import TopicExcellentList from '~/components/TopicExcellentList.vue'
  import TopicDefaulttList from '~/components/TopicDefaulttList.vue'

  const props = defineProps({
    currentTab: {
      type: String,
      default: "default",
    },
    page: {
      type: Number,
      default: 1,
    },
  })

  const currentTabToName = (p: string): string => {
    switch (p) {
      case "excellent":
        return "excellent"
      case "noreply":
        return "noreply"
      case "new":
        return "new"
      default:
        return "default"
    }
  }

  let currentTab = ref(currentTabToName(props.currentTab))
  let page = ref(props.page)

</script>

<style lang="scss" scoped>
.nav-item {
  text-align: center;
  font-size: 20px;

  &:hover {
    color: #343a40;
  }
}
</style>
