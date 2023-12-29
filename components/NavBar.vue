<template>
  <el-page-header
    title="回到首页"
    class="h-10 my-2 mx-5"
    @back="onBack"
  >
    <template #icon>
      <el-image style="width: 50px; height: 50px" :src="Logo" fit="contain" />
    </template>

    <template #title>
      <span class="text-2xl"> {{ siteName }} </span>
    </template>

    <template #content>
      <el-button-group>
        <el-button
          v-for="(nav, index) in setting.siteNavs"
          :key="index"
          type="success"
          text
          @click="navClick(nav)"
        >
          {{ nav.title }}
        </el-button>
      </el-button-group>
    </template>

    <template #extra>
      <client-only>
        <div class="flex flex-row justify-between items-center">
          <div class="flex flex-row items-center mx-3">
            <el-dropdown trigger="click">
              <div class="flex flex-row items-center">
                <el-text class="flex flex-row items-center">
                  <el-icon size="20px"><Plus /></el-icon>
                  新增
                </el-text>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-link href="/topic/create">
                      话题
                    </el-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-link href="/article/create">
                      文章
                    </el-link>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <div class="flex flex-row items-center mx-3">
            <el-dropdown trigger="click">
              <el-badge :value="msgcount > 9 ? '9+' : msgcount" :hidden="msgcount === 0">
                <div class="flex flex-row items-center">
                  <el-text class="flex flex-row items-center">
                    <el-icon><Bell /></el-icon>
                    消息
                  </el-text>
                </div>
              </el-badge>
              <template #dropdown>
                <div class="dropdown-content msglist-wrapper">
<!--                  还未配置，等对接用户中心-->
                  <div class="msglist">
                    <ul>
                      <li v-for="msg in messages" :key="msg.messageId" class="msg-item">
                        <a :href="'/user/' + msg.from.id" :title="Utils.getUserName(msg.from)">
                          <img
                            v-lazy="runtimeConfig.public.AVATAR_URL + '?uid=' + msg.from.uid"
                            class="avatar size-20"
                          />
                        </a>
                        <a href="/user/notifications">{{ msg.content }}</a>
                      </li>
                    </ul>
                  </div>
                  <div class="flex justify-between items-center mx-3 my-3">
                    <a href="/user/notifications">消息中心&gt;&gt;</a>
                  </div>
                </div>
              </template>
            </el-dropdown>
          </div>

          <div v-if="isAdmin" class="navbar-item dropdown mx-3">
            <el-link href="/admin" class="flex flex-row items-center">
              <el-icon size="20px"><HomeFilled /></el-icon>
              管理后台
            </el-link>
          </div>

          <div v-if="user" class="flex flex-row items-center mx-3">
            <el-dropdown trigger="click">
              <div class="flex flex-row items-center">
                <el-text>{{ username }}</el-text>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <el-link :href="'/user/' + user.id">
                      我的首页
                    </el-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-link href="/user/settings">
                      编辑资料
                    </el-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-link href="/user/favorites">
                      我的收藏
                    </el-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-text @click="logout">
                      退出登录
                    </el-text>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div v-else class="navbar-item">
            <el-button @click="login">
              登录
            </el-button>
          </div>
        </div>
      </client-only>
    </template>
  </el-page-header>
</template>

<script setup lang="ts">
import Utils from '~/common/utils'
import { useConfigStore } from '~/store/config'
import { useAuthStore } from '~/store/auth'
import { ElMessage } from "element-plus"
import Logo from "~/assets/images/logo.png"
import {HomeFilled, Plus, Bell} from "@element-plus/icons-vue"

const configStore = useConfigStore()
const authStore = useAuthStore()
let msgcount = ref(0)
let messages = ref([])
const runtimeConfig = useRuntimeConfig()

let user = computed(()=>{
  return authStore.currentUser
})

const getMsgcount = async () => {
  if (user) {
    // 还未对接用户中心
    // const ret = await this.$axios.get('/api/user/notifications/recent')
    // this.msgcount = ret.count
    // this.messages = ret.notifications
  }
}

await getMsgcount()

let username = computed((): string => {
  return authStore.currentUserName
})

let isAdmin = computed((): boolean => {
  const user = authStore.currentUser
  const LevelUserAdmin = configStore.appinfo.user_level_admin
  return user && user.level === LevelUserAdmin
})

let setting = computed((): any => {
  return configStore.setting
})

let siteName = computed((): any => {
  return Utils.siteTitle('')
})

const login = async () => {
  await Utils.toSignin()
}

const logout = async () => {
  try {
    await authStore.logout()
    let ref = '/'
    if (ref === '/' && process.client) {
      ref = window.location.pathname
    }

    ElMessage.success("退出成功")
    setTimeout(()=> {
      Utils.linkTo(ref)
    }, 1000)
  } catch (e) {
    console.error(e)
  }
}
const onBack = async () => {
  await Utils.linkTo("/")
}

const navClick = (nav) => {
  Utils.openTo(nav.url)
}

</script>

<style lang="scss" scoped></style>
