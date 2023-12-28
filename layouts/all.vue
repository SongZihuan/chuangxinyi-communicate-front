<template>
  <NavBar />
    <slot />
  <Footer />
  <BackToTop />
</template>

<script setup lang="ts">
import NavBar from '~/components/NavBar'
import Footer from '~/components/Footer'
import BackToTop from '~/components/BackToTop.vue'
</script>
