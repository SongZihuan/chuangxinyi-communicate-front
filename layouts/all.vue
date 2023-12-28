<template>
  <div class="zendea">
    <NavBar />
      <slot />
    <Footer />
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import NavBar from '~/components/NavBar'
import Footer from '~/components/Footer'
import BackToTop from '~/components/BackToTop.vue'
</script>
