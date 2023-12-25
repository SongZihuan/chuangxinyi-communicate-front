<template>
  <div class="">
    <div v-if="show" @click="backToTop" class="back-to-top">
      回顶部
    </div>
  </div>
</template>

<script setup lang="ts">

let show = ref(false)
let timer = ref("")
let speed = ref(10)

const getScrollTop = () => {
  return document.documentElement.scrollTop || document.body.scrollTop
}

const backToTop = () => {
  const currentScroll = getScrollTop()
  if (currentScroll > 0) {
    window.scrollTo(0, currentScroll - speed.value)
    // 加速
    speed.value += 2
    timer.value = requestAnimationFrame(() => {
      backToTop()
    })
  } else {
    speed.value = 10
    cancelAnimationFrame(timer.value)
  }
}

onMounted(()=>{
  window.addEventListener('scroll', () => {
    show.value = getScrollTop() > leaveTop.value
  })
})

</script>

<style scoped lang="scss">
@import '@/assets/styles/variables';
.back-to-top {
  position: fixed;
  right: 40px;
  bottom: 80px;
  padding: 10px;
  width: 36px;
  color: #999;
  text-align: center;
  line-height: 1.25;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  z-index: 9999;
  &:hover {
    background: #f3f3f3;
  }
}
</style>
