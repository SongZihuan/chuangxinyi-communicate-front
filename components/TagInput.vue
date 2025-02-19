<template>
  <div class="w=[100%]">
    <client-only>
      <el-autocomplete
        v-model="tagInput"
        :fetch-suggestions="autocomplete"
        :placeholder="'标签（请用逗号分隔每个标签，最多' + maxTagCount + '个，每个最长15字符）'"
        @keydown.delete="removeTag"
        @keydown.enter="addTag"
        @keydown.tab="addTag"
        @keydown.space="addTag"
        class="w-[100%]"
      >
        <template #prefix>
          <el-tag
            v-for="tag in tags"
            :key="tag"
            @click="clickRemoveTag(tag)"
            class="mx-1"
          >
            {{ tag }}
          </el-tag>
        </template>
      </el-autocomplete>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import {useConfigStore} from '~/store/config'
import {useTopicApi} from '~/api/topics'

const configStore = useConfigStore()

const props = defineProps({
  modelValue: {
    type: Array,
    default() {
      return []
    }
  }
})

let tags = ref(props.modelValue || [])
let maxTagCount = ref(3)
let maxWordCount = ref(15)
let tagInput = ref("")

let emit = defineEmits(["update:modelValue"])

const removeTag = () => {
  if (!tagInput.value) {
    tags.value.splice(tags.value.length - 1, 1)
    emit('update:modelValue', tags.value)
  }
}

const clickRemoveTag = (tag: string) => {
  const index = tags.value.indexOf(tag)
  if (index !== -1) {
    tags.value.splice(index, 1)
    emit('update:modelValue', tags.value)
  }
}

/**
 * 添加标签
 * @param event
 */
const addTag = () => {
  if (!tagInput.value) {
    return
  }

  addTagName(tagInput.value)
  tagInput.value = ""
}

const addTagName = (tagName: string) => {
  if (!tagName) {
    return false
  }

  if (tags.value && tags.value.length >= maxTagCount.value) {
    ElMessage.error("标签太多了")
    return false
  }

  // 每个标签最多15个字符
  if (tagName.length > maxWordCount.value) {
    ElMessage.error("标签字符太多了")
    return false
  }

  // 标签已经存在
  if (tags.value && tags.value.includes(tagName).value) {
    ElMessage.error("标签已存在了")
    return false
  }

  tags.value.push(tagName)
  emit('update:modelValue', tags.value)
  return true
}

const autocomplete = async (queryString: string, cb) => {
  if (!queryString) {
    if (!configStore.setting.recommendTags) {
      cb([])
      return
    }

    console.log(configStore.setting.recommendTags)

    let res = []
    for (let i = 0; i < configStore.setting.recommendTags.length; i++) {
      res.push({ value: configStore.setting.recommendTags[i], data: null })
    }

    cb(res)
    return
  } else {
    let {data, status} = await useTopicApi().tagAutoComplete({
      input: queryString
    })

    if (status.value === "success" && data.value.success) {
      let res = []
      if (data.value.data.length > 0) {
        for (let i = 0; i < data.value.data.length; i++) {
          res.push({ value: data.value.data[i].name, data: data.value.data[i] })
        }
      }
      cb(res)
      return
    }
  }

  cb([])  // 兜底
}

defineExpose({
  addTagName,
  removeTag,
})

</script>

<style lang="scss" scoped>
.select-tags {
  display: flex;
  background-color: #fff;
  border: 1px solid #dbdbdb;
  //border-radius: 4px;
  //box-shadow: inset 0 1px 2px rgba(10, 10, 10, .1);
  color: #363636;
  padding: 0 8px;

  .input {
    border: none;
    box-shadow: none;
    margin: 0;
    padding: 0;
  }

  .tags-selected {
    display: flex;

    span.tag-item {
      margin: 5px 5px 5px 0;
      padding: 0 5px;
      background: #eee;
      color: #000;

      .text {
        text-align: center;
        vertical-align: middle;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.38);
        white-space: nowrap;
        display: inline-block;

        i {
          font-size: 12px;
          margin-left: 4px;
        }

        i:hover {
          color: red;
          cursor: pointer;
        }
      }
    }
  }

  .autocomplete-tags {
    z-index: 2000;
    left: 0;
    right: 0;
    top: 38px;
    bottom: 0;
    position: absolute;

    .tags-container {
      scroll-behavior: smooth;
      position: relative;
      background: #f7f7f7;
      border-left: 1px solid #dbdbdb;
      border-right: 1px solid #dbdbdb;
      border-bottom: 1px solid #dbdbdb;

      .tag-section {
        font-size: 14px;
        line-height: 16px;

        .tag-item {
          padding: 8px 15px;
          cursor: pointer;

          &.active,
          &:hover {
            color: #fff;
            background: #006bde;
          }
        }
      }
    }
  }

  .recommend-tags {
    z-index: 2000;
    left: 0;
    right: 0;
    top: 38px;
    bottom: 0;
    position: absolute;

    .tags-container {
      scroll-behavior: smooth;
      position: relative;
      background: #f7f7f7;
      border-left: 1px solid #dbdbdb;
      border-right: 1px solid #dbdbdb;
      border-bottom: 1px solid #dbdbdb;
      padding: 0 10px 10px 10px;

      .header {
        font-weight: bold;
        font-size: 15px;
        color: #017e66;
        border-bottom: 1px solid #dbdbdb;
        margin-bottom: 5px;
        padding-top: 5px;
        padding-bottom: 5px;

        .close-recommend {
          float: right;
          cursor: pointer;
          &:hover {
            color: red;
          }
        }
      }

      .tag-item {
        padding: 0 11px;
        border-radius: 11px;
        display: inline-block;
        color: #017e66;
        background-color: rgba(1, 126, 102, 0.08);
        height: 22px;
        line-height: 22px;
        font-weight: normal;
        font-size: 13px;
        text-align: center;

        &:not(:last-child) {
          margin-right: 5px;
        }

        img {
          width: 16px;
          height: 16px;
          margin-right: 5px;
          margin-top: -1px;
          vertical-align: middle;
        }
      }

      .tag-item:hover,
      .tag-item:focus {
        background-color: #017e66;
        color: #fff;
        text-decoration: none;
      }
    }
  }
}
</style>
