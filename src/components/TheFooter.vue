<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="pb-2 pt-4 mt-auto">
    <div class="border-1 border-top pt-4">
      <p class="text-center text-body-secondary">
        &copy; {{ year <= 2024 ? 2024 : `2024 - ${year}` }} Кудрявцев Максим. Все права защищены.
      </p>
    </div>
  </footer>
</template>

<style scoped lang="scss">

</style>