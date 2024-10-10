<script setup lang="ts">
import {watch, ref} from 'vue'
import {Toast} from 'bootstrap'
import {useToastStore} from '@/stores/toasts'

const toast_store = useToastStore()

const toasts = ref<HTMLDivElement[]>([])

watch(() => toasts.value?.length, () => {
  for (const toast of toasts.value) {
    if (toast instanceof HTMLDivElement) {
      if (Toast.getInstance(toast) === null) {
        const toastId = parseInt(toast.dataset.toastId ?? '-1')
        const toastType = toast_store.toasts.find((toast) => toast.id === toastId)?.type
        // Errors must be shown much more time that other messages for catching them using screenshot/screencast or Zoom call
        const toastInstance = Toast.getOrCreateInstance(toast, {delay: toastType === 'error' ? 10 * 60 * 1000 : 3 * 1000})

        toast.addEventListener('hidden.bs.toast', () => {
          toast_store.remove(toastId)
          toastInstance.dispose()
        })

        toastInstance.show()
      }
    }
  }
})
</script>

<template>
  <Teleport to="#app">
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div v-for="toast in toast_store.toasts"
           :key="toast.id"
           ref="toasts"
           class="toast"
           :class="{'bg-danger-subtle': toast.type === 'error', 'bg-info-subtle': toast.type === 'info', 'bg-success-subtle': toast.type === 'success'}"
           role="alert"
           :data-toast-id="toast.id"
           aria-live="assertive"
           aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">
            <template v-if="toast.type === 'info'">Уведомление</template>
            <template v-if="toast.type === 'success'">Успешно</template>
            <template v-if="toast.type === 'error'">Ошибка</template>
          </strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body" v-html="toast.message"></div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">

</style>