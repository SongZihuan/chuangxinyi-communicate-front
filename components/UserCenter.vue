<template>
  <div class="flex justify-center w-[100%]">
    <el-tabs v-model="currentTab" class="w-[95%]" stretch>
      <el-tab-pane label="默认" name="topics">
        <TopicUserListRecent :user-id="userId" />
        <template #label>
          <span class="nav-item">
            话题
          </span>
        </template>
      </el-tab-pane>
      <el-tab-pane label="精华帖" name="articles">
        <ArticleUserListRecent :user-id="userId" />
        <template #label>
          <span class="nav-item">
            文章
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    currentTab: {
      type: String,
      default: "topics",
    },
    userId: {
      type: Number,
      require: true,
    }
  })

  let userId = ref(props.userId)
  console.log("AAB", userId.value)

  const currentTabToName = (p: string): string => {
    switch (p) {
      case "articles":
        return "articles"
      default:
        return "topics"
    }
  }

  let currentTab = ref(currentTabToName(props.currentTab))
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
