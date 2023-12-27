<template>
  <div class="select-tags">
    <input id="tags" v-model="tags" name="tags" type="hidden" />
    <div class="tags-selected">
      <span v-for="tag in tags" :key="tag" class="tag-item">
        <span class="text"
          >{{ tag
          }}<i
            :data-name="tag"
            @click="clickRemoveTag"
            class="iconfont icon-close"
        /></span>
      </span>
    </div>
    <input
      ref="tagInput"
      v-model="inputTag"
      :placeholder="
        '标签（请用逗号分隔每个标签，最多' +
          maxTagCount +
          '个，每个最长15字符）'
      "
      @input="autocomplete"
      @keydown.delete="removeTag"
      @keydown.enter="addTag"
      @keydown.tab="addTag"
      @keydown.space="addTag"
      @keydown.up="selectUp"
      @keydown.down="selectDown"
      @keydown.esc="close"
      @focus="openRecommendTags"
      @blur="closeRecommendTags"
      @click="openRecommendTags"
      class="input"
      type="text"
    />
    <div v-if="autocompleteTags.length > 0" class="autocomplete-tags">
      <div class="tags-container">
        <section class="tag-section">
          <div
            v-for="(item, index) in autocompleteTags"
            :key="item"
            :class="{ active: index === selectIndex }"
            @click="selectTag(index)"
            v-text="item"
            class="tag-item"
          />
        </section>
      </div>
    </div>
    <div v-if="showRecommendTags" class="recommend-tags">
      <div class="tags-container">
        <div class="header">
          <span>推荐标签</span>
          <span class="close-recommend"
            ><i @click="closeRecommendTags" class="iconfont icon-close"
          /></span>
        </div>
        <a
          v-for="tag in recommendTags"
          :key="tag"
          @click="addRecommendTag(tag)"
          v-text="tag"
          class="tag-item"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useConfigStore} from '~/store/config'
import {useTopicApi} from '~/api/topics'

const configStore = useConfigStore()

const props = defineProps({
  value: {
    type: Array,
    default() {
      return []
    }
  }
})

let tags = ref(props.value || [])
let maxTagCount = ref(3)
let maxWordCount = ref(15)
let showRecommendTags = ref(false)
let inputTag = ref("")
let autocompleteTags = ref([])
let selectIndex = ref(-1)

let tagInput = ref(null)

let recommendTags = computed(() => {
  return configStore.setting.recommendTags
})

let emit = defineEmits(["input"])

const removeTag = () => {
  const selectionStart = tagInput.value.selectionStart
  if (!inputTag.value || selectionStart === 0) {
    // input框没内容，或者光标在首位的时候就删除最后一个标签
    tags.value.splice(tags.value.length - 1, 1)
    emit('input', tags.value)
  }
}

const clickRemoveTag = (event) => {
  const tag = event.target.dataset.name
  if (tag) {
    const index = tags.value.indexOf(tag)
    if (index !== -1) {
      tags.value.splice(index, 1)
      emit('input', tags.value)
    }
  }
}

/**
 * 手动点击选择标签
 * @param index
 */
const selectTag = (index) => {
  selectIndex.value = index
  addTag()
}

/**
 * 添加标签
 * @param event
 */
const addTag = (event) => {
  if (event) {
    event.stopPropagation()
    event.preventDefault()
  }

  if (
    selectIndex.value >= 0 &&
    autocompleteTags.value.length > selectIndex.value
  ) {
    addTagName(autocompleteTags.value[selectIndex.value])
  } else {
    addTagName(inputTag.value)
  }
  autocompleteTags.value = []
  selectIndex.value = -1
}

/**
 * 添加推荐标签
 * @param tagName
 */
const addRecommendTag = (tagName) => {
  addTagName(tagName)
  closeRecommendTags()
}

/**
 * 添加标签
 * @param tagName 标签名称
 * @returns {boolean} 是否成功
 */
const addTagName = (tagName) => {
  if (!tagName) {
    return false
  }

  // 最多四个标签
  if (tags.value && tags.value.length >= maxTagCount.value) {
    return false
  }

  // 每个标签最多15个字符
  if (tagName.length > maxWordCount.value) {
    return false
  }

  // 标签已经存在
  if (tags.value && tags.value.includes(tagName).value) {
    return false
  }

  tags.value.push(tagName)
  inputTag.value = ''
  emit('input', tags.value)
  return true
}

const autocomplete = async () => {
  closeRecommendTags()
  selectIndex.value = -1
  if (!inputTag.value) {
    autocompleteTags.value = []
  } else {
    let {data, status} = await useTopicApi().tagAutoComplete({
      input: inputTag.value
    })

    if (status.value === "success" && data.value.success) {
      autocompleteTags.value = []
      if (data.value.data.length > 0) {
        for (let i = 0; i < data.value.data.length; i++) {
          autocompleteTags.value.push(data.value.data[i].name)
        }
      }
    }
  }
}

const selectUp = (event) => {
  event.stopPropagation()
  event.preventDefault()
  const curIndex = selectIndex.value
  const maxIndex = autocompleteTags.value.length - 1
  if (maxIndex < 0 || curIndex < 0) {
    // 已经在最顶部
    return
  }
  selectIndex.value--
}

const selectDown = (event) => {
  event.stopPropagation()
  event.preventDefault()
  const curIndex = selectIndex.value
  const maxIndex = autocompleteTags.value.length - 1
  if (maxIndex < 0 || curIndex >= maxIndex) {
    // 已经在最底部
    return
  }
  selectIndex.value++
}

// 关闭推荐
const openRecommendTags = () => {
  showRecommendTags.value = true
}

// 开启推荐
const closeRecommendTags = () => {
  setTimeout(() => {
    showRecommendTags.value = false
  }, 300)
}

// 关闭自动补全
const close = () => {
  if (autocompleteTags.value && autocompleteTags.value.length > 0) {
    autocompleteTags.value = []
    selectIndex.value = -1
  }
  closeRecommendTags()
}
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
