<template>
  <NavBar />
  <div class="flex flex-col items-center">
    <div class="w-[80%] flex flex-col items-start">
      <slot />
    </div>
  </div>
  <Footer />
  <BackToTop />
</template>

<script setup lang="ts">
import NavBar from '~/components/NavBar'
import Footer from '~/components/Footer'
import BackToTop from '~/components/BackToTop.vue'
</script>
