<script setup lang="ts">
import {onBeforeMount, ref, inject} from 'vue'
import type {Contact} from '@openapi/api-client'
import {useToastStore} from '@/stores/toasts'
import {BotAPIsList} from '@/symbols'
import {faPhoneFlip, faGlobe} from '@fortawesome/free-solid-svg-icons'
import {faEnvelopeOpen} from '@fortawesome/free-regular-svg-icons'
import {faWhatsapp, faTelegram} from '@fortawesome/free-brands-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import Modal from '@/components/twbs/Modal.vue'

const toasts = useToastStore()

const is_open = ref<boolean | undefined>(true)
const loading = ref<boolean | undefined>(true)
const singleContact = ref<Contact>({id: 0, first_name: '', last_name: '', phone_number: '', email: '', resume_url: ''})

const apis = inject(BotAPIsList)

const submit = async () => {
  loading.value = true
  const contactName = [singleContact.value.first_name, singleContact.value.last_name].join(' ')

  try {
    await apis!.contacts.updateContact(singleContact.value.id, {...singleContact.value})
    toasts.success(`Контакт <span class="fw-bolder fst-italic">${contactName}</span> успешно изменен`)

    is_open.value = undefined
  } catch (arr: unknown) {
    toasts.error(`Не удалось обновить контакт <span class="fw-bolder fst-italic">${contactName}</span>`)
  } finally {
    loading.value = false
  }
}

onBeforeMount(async () => {
  loading.value = true

  try {
    const {data} = await apis!.contacts.listContacts()

    if (data.length === 0) {
      toasts.error('Не найдено ни одного контакта')

      loading.value = false
      is_open.value = undefined

      return
    }

    singleContact.value = data[0]
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <Modal :show="!! is_open">
    <form @submit.prevent="submit" @keyup.ctrl.enter="submit">
      <div class="mb-2">
        <label for="contact-first-name-label" class="form-label">Имя</label>
        <input type="text"
               name="first_name"
               v-model.trim="singleContact.first_name"
               class="form-control"
               id="contact-first-name-label"
               :disabled="loading">
      </div>
      <div class="mb-2">
        <label for="contact-last-name-label" class="form-label">Фамилия</label>
        <input type="text"
               name="last_name"
               v-model.trim="singleContact.last_name"
               class="form-control"
               id="contact-last-name-label"
               :disabled="loading">
      </div>
      <div class="mb-2">
        <label for="contact-phone-number-label" class="form-label">Телефон</label>
        <div class="btn-toolbar">
          <div class="input-group flex-grow-1">
            <input type="text"
                   name="phone_number"
                   v-model.trim="singleContact.phone_number"
                   class="form-control"
                   id="contact-phone-number-label"
                   :disabled="loading">
          </div>
          <div class="btn-group ms-2" role="group" aria-label="Contact group">
            <a :href="['tel:', singleContact.phone_number].join('+')" target="_blank" class="btn btn-outline-secondary">
              <FontAwesomeIcon :icon="faPhoneFlip" title="Телефон" size="lg" class="text-secondary"/>
            </a>
            <a :href="['https://t.me/', singleContact.phone_number].join('+')" target="_blank" class="btn btn-outline-primary">
              <FontAwesomeIcon :icon="faTelegram" title="Telegram" size="lg" class="text-primary"/>
            </a>
            <a :href="['https://wa.me/', singleContact.phone_number].join('+')" target="_blank" class="btn btn-outline-success">
              <FontAwesomeIcon :icon="faWhatsapp" title="Whatsapp" size="lg" class="text-success"/>
            </a>
          </div>
        </div>
      </div>
      <div class="mb-2">
        <label for="contact-email-label" class="form-label">Email</label>
        <div class="btn-toolbar">
          <div class="input-group flex-grow-1">
            <input type="text"
                   name="email"
                   v-model.trim="singleContact.email"
                   class="form-control"
                   id="contact-email-label"
                   :disabled="loading">
          </div>
          <div class="btn-group ms-2">
            <a :href="['mailto', singleContact.email].join(':')" target="_blank" class="btn btn-outline-secondary">
              <FontAwesomeIcon :icon="faEnvelopeOpen" title="Email" size="lg" class="text-secondary"/>
            </a>
          </div>
        </div>
      </div>
      <div class="mb-2">
        <label for="contact-resume-label" class="form-label">Резюме</label>
        <div class="btn-toolbar">
          <div class="input-group flex-grow-1">
            <input type="text"
                   name="resume"
                   v-model.trim="singleContact.resume_url"
                   class="form-control"
                   id="contact-resume-label"
                   :disabled="loading">
          </div>
          <div class="btn-group ms-2">
            <a :href="singleContact.resume_url" target="_blank" class="btn btn-outline-secondary">
              <FontAwesomeIcon :icon="faGlobe" title="Резюме" size="lg" class="text-secondary"/>
            </a>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-between align-items-center mt-4">
        <span class="flex-grow-1 text-end me-2 opacity-50 fst-italic">Ctrl + Enter</span>
        <button type="submit" class="btn btn-success" :disabled="loading">
          <span v-show="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
          <span :class="{'ms-2': loading}" role="status">
            {{ loading ? 'Подождите...' : 'Сохранить' }}
          </span>
        </button>
      </div>
    </form>
  </Modal>
</template>

<style scoped lang="scss">
.btn-group {
  > a:hover,
  > a:active {
    .text-primary,
    .text-secondary,
    .text-success {
      color: unset !important;
    }
  }
}
</style>