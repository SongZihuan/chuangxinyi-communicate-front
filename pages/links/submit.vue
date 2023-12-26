<template>
  <section class="main">
    <div class="container">
      <div class="main-body">
        <div class="notice">
          <h1>收录规则：</h1>
          <ul>
            <li>只收录编程相关的技术博客</li>
            <li>拒绝SEO类型博客</li>
            <li>拒绝大量转载文章的博客</li>
            <li>独立博客优先</li>
            <li>提交后我们会进行审核，审核通过后即可显示</li>
          </ul>
        </div>

        <div class="widget">
          <div class="widget-header">
            提交博客地址
          </div>
          <div class="widget-content">
            <div class="field">
              <label class="label">博客链接</label>
              <div class="control">
                <input
                  v-model="url"
                  @keyup.enter="submitLink"
                  class="input"
                  type="text"
                  placeholder="博客链接 必填 以 http(s):// 开头"
                />
              </div>
            </div>

            <div class="field">
              <label class="label">博客标题</label>
              <div class="control">
                <input
                  v-model="title"
                  @keyup.enter="submitLink"
                  class="input"
                  type="text"
                  placeholder="博客标题 必填"
                />
              </div>
            </div>

            <div class="field">
              <label class="label">博客简介</label>
              <div class="control">
                <input
                  v-model="summary"
                  @keyup.enter="submitLink"
                  class="input"
                  type="text"
                  placeholder="博客简介 必填"
                />
              </div>
            </div>

            <div class="field">
              <label class="label">博客Logo</label>
              <div class="control">
                <input
                  v-model="logo"
                  @keyup.enter="submitLink"
                  class="input"
                  type="text"
                  placeholder="博客Logo（非必填请填写Logo链接）"
                />
              </div>
            </div>

            <div class="field">
              <div class="control">
                <button
                  :class="{ 'is-loading': publishing }"
                  :disabled="publishing"
                  @click="submitLink"
                  class="button is-link"
                >
                  提交
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Utils from '~/common/utils'
import {ElMessage} from "element-plus"
import {useLinksApi} from '~/api/links'

let publishing = ref(false)
let url = ref("")
let title = ref("")
let summary = ref("")
let logo = ref("")

const submitLink = async () => {
  if (publishing.value) {
    return
  }
  publishing.value = true

  try {
    let {data, status} = await useLinksApi().create({
      url: this.url,
      title: this.title,
      summary: this.summary,
      logo: this.logo
    })
    if (status.value === "success" && data.value.success) {
      ElMessage.info('提交成功，请耐心等待审核。')
      setTimeout(async ()=>{
        await Utils.linkTo('/links/1')
      }, 1000)
    } else {
      publishing.value = false
      ElMessage.error("提交失败")
    }
  } catch (e) {
    publishing.value = false
    ElMessage.error(e.message || e)
  }
}

useHead({
  title: Utils.siteTitle('提交博客')
})
</script>

<style lang="scss" scoped>
.notice {
  padding: 7px 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: #fcf8e3;
  border-color: #faebcc;
  color: #8a6d3b;

  a {
    color: #3273dc;
    cursor: pointer;
  }

  h1 {
    font-weight: bold;
  }

  p:not(:last-child) {
    margin-bottom: 10px;
  }

  ul {
    list-style: disc;
    margin-left: 20px;
    margin-top: 10px;
  }
}
</style>
