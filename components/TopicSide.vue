<template>
  <div class="flex justify-center w-[100%]">
    <div class="w-[95%]">
      <PostBtnSidebar :current-node-id="currentNodeId" :current-tag="currentTag" />
      <SiteNotice />
      <SiteTip />
      <SocreRank />
      <Links />
      <SiteStat />
    </div>
  </div>
</template>

<script setup lang="ts">
import PostBtnSidebar from '~/components/PostBtnSidebar'
import SiteNotice from '~/components/SiteNotice'
import SiteTip from '~/components/SiteTip'
import SiteStat from '~/components/SiteStat'

const props = defineProps({
  currentNodeId: {
    type: Number,
    default: 0,
  },
  currentTag: {
    type: String,
    default: "",
  }
})

let currentNodeId = ref(props.currentNodeId)
let currentTag = ref(props.currentTag)
</script>

<style lang="scss" scoped>
.links {
  img {
    width: 130px;
  }
  .link-title {
    font-size: 14px;
  }
  .link-summary {
    font-size: 12px;
  }
}
.score-rank {
  li {
    display: flex;
    list-style: none;
    margin: 8px 0;
    font-size: 13px;
    position: relative;

    &:not(:last-child) {
      border-bottom: 1px solid #f7f7f7;
    }

    .score-user-avatar {
      min-width: 30px;
      .avatar {
        width: 30px;
        height: 30px;
      }
    }

    .score-user-info {
      width: 100%;
      margin-left: 5px;
      line-height: 1.4;
      font-size: 12px;
      a {
        font-weight: 700;
        &:hover {
          text-decoration: underline;
        }
      }
    }

    .score-rank-info {
      width: 120px;
      .score-user-score {
        float: right;
        border-radius: 12px;
        color: #778087;
        height: 21px;
        line-height: 21px;
        padding: 0 6px;
        text-shadow: 0 0 1px #fff;
        background-color: #f5f5f5;
        font-size: 0.75rem;
        align-items: center;
        i {
          margin-right: 3px;
        }
      }
    }
  }
}
</style>
