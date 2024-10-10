<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {Modal} from 'bootstrap'

const route = useRoute()
const router = useRouter()

const props = defineProps<{
  show?: boolean
}>()

const event = defineEmits<{
  shown: [void]
  hidden: [void]
}>()

const bsModal = ref<HTMLDivElement>()

watch(() => props.show, () => {
  if (bsModal.value instanceof HTMLDivElement) {
    Modal.getOrCreateInstance(bsModal.value).toggle()
  }
})

onMounted(() => {
  if (bsModal.value instanceof HTMLDivElement) {
    bsModal.value?.addEventListener('shown.bs.modal', () => event('shown'))
    bsModal.value?.addEventListener('hidden.bs.modal', () => {
      if (route.query?.actions) {
        router.replace({query: {}})
      }

      return event('hidden')
    })

    Modal.getOrCreateInstance(bsModal.value).show()
  }
})

onBeforeUnmount(() => {
  if (bsModal.value instanceof HTMLDivElement) {
    Modal.getOrCreateInstance(bsModal.value).dispose()
  }
})
</script>

<template>
  <Teleport to="body">
    <div class="modal fade" ref="bsModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <slot/>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">

</style>