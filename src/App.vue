<script setup lang="ts">
import {RouterView} from 'vue-router'
import TheHeader from '@/components/TheHeader.vue'
import ToastStack from '@/components/twbs/Toast.vue'
import TheFooter from '@/components/TheFooter.vue'
</script>

<template>
  <TheHeader/>
  <RouterView/>
  <ToastStack/>
  <TheFooter/>
</template>

<style scoped lang="scss">

</style>
