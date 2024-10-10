<script setup lang="ts">
import {RouterView} from 'vue-router'
import TheHeader from '@/components/TheHeader.vue'
import ToastStack from '@/components/twbs/Toast.vue'
</script>

<template>
  <TheHeader/>
  <RouterView/>
  <ToastStack/>
</template>

<style scoped lang="scss">

</style>
