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
              <div class="flex flex-row items-center">
                <el-text class="flex flex-row items-center">
                  <el-icon><Bell /></el-icon>
                  消息
                </el-text>
              </div>
              <template #dropdown>
                <div class="dropdown-content msglist-wrapper">
                  <div class="msglist">
                    <el-card v-for="msg in messages" :key="msg.id" class="m-1">
                      <div>
                        <el-text>
                          {{ msg.title }}
                        </el-text>
                      </div>
                      <div>
                        <div>
                          {{ msg.content }}
                        </div>
                      </div>
                    </el-card>
                  </div>
                  <div class="flex flex-col justify-end items-end my-2 mx-2">
                    <el-link href="/user/notifications">消息中心</el-link>
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
import Logo from "assets/images/logo.png"
import {HomeFilled, Plus, Bell} from "@element-plus/icons-vue"
import {useMsgStore} from '~/store/msg'

const configStore = useConfigStore()
const authStore = useAuthStore()
let messages = ref([])

let user = computed(()=>{
  return authStore.currentUser
})

let msgStore = useMsgStore()

const getMsgcount = () => {
  messages.value = msgStore.msgList
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
  await Utils.toLogout()
}
const onBack = async () => {
  await Utils.linkTo("/")
}

const navClick = (nav) => {
  Utils.openTo(nav.url)
}

</script>

<style lang="scss" scoped></style>
