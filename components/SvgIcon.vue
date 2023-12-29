<template>
  <svg :class="svgClass" v-bind="$attrs" :style="`width: ${props.w}px; height: ${props.h}px;`">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  w: {
    type: Number,
    default: 500,
  },
  h: {
    type: Number,
    default: 500,
  },
})

const iconName = computed(() => `#icon-${props.name}`)
const svgClass = computed(() => {
  if (props.name) {
    return `svg-icon icon-${props.name}`
  }
  return 'svg-icon'
})
</script>

<style lang="scss">
</style>
