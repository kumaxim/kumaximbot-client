<script setup lang="ts">
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {faArrowRightFromBracket, faArrowRightToBracket, faHouse, faSquarePlus} from '@fortawesome/free-solid-svg-icons'
import {faCalendarDays, faAddressCard} from '@fortawesome/free-regular-svg-icons'
import {faTelegramPlane, faYandex} from '@fortawesome/free-brands-svg-icons'
import {Offcanvas} from 'bootstrap'
import {inject, onBeforeUnmount, onMounted, onUpdated, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import type {User} from '@openapi/api-client'
import {useAuthStore} from '@/stores/auth'
import {BotAPIsList} from '@/symbols'
import PostForm from '@/components/PostForm.vue'
import ContactForm from '@/components/ContactForm.vue'

const route = useRoute()
const router = useRouter()

const apis = inject(BotAPIsList)

const auth = useAuthStore()
const myself = ref<User>()

const logout = async () => {
  if (auth.isLoggedIn) {
    await apis!.users.removeOAuth2Token({access_token: auth.accessToken as string})
    auth.clearToken()
  }
}

const tgBotUsername = `@${import.meta.env.VITE_TELEGRAM_BOT_USERNAME}`
const tgBotUrl = `https://t.me/${import.meta.env.VITE_TELEGRAM_BOT_USERNAME}`

const canvas = ref<HTMLDivElement>()

const getOrCreateInstance = () => {
  if (canvas.value instanceof HTMLDivElement) {
    return Offcanvas.getOrCreateInstance(canvas.value)
  }
}

const offcanvasBodyToggle = () => getOrCreateInstance()?.toggle()
const offcanvasBodyShow = ref<boolean>(false)

onBeforeUnmount(() => getOrCreateInstance()?.dispose())

onMounted(() => {
  if (canvas.value instanceof HTMLDivElement) {
    canvas.value.addEventListener('hide.bs.offcanvas', () => {
      offcanvasBodyShow.value = false
    })

    canvas.value.addEventListener('show.bs.offcanvas', () => {
      offcanvasBodyShow.value = true
    })
  }
})

onUpdated(async () => {
  if (auth.isLoggedIn && ! myself.value?.display_name) {
    const {data: user} = await apis!.users.getUserInfo()
    myself.value = user
  }
})
</script>

<template>
  <PostForm v-if="route.query && route.query.actions?.includes('post_add')" />
  <ContactForm v-if="route.query && route.query.actions?.includes('contact')" />

  <nav class="navbar navbar-expand-lg bg-body-tertiary border border-bottom">
    <div class="container">
      <a class="navbar-brand" :href="tgBotUrl" target="_blank">
        <FontAwesomeIcon :style="['color: #229ED9']" :icon="faTelegramPlane" size="2xl"/>
        <span class="ms-2">{{ tgBotUsername }}</span>
      </a>
      <button class="navbar-toggler" type="button" @click.prevent="offcanvasBodyToggle" aria-expanded="false"
              aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div ref="canvas" class="offcanvas offcanvas-end" tabindex="-1">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title">
            <FontAwesomeIcon :style="['color: #229ED9']" :icon="faTelegramPlane" size="xl"/>
            <span class="ms-2 fw-normal">{{ tgBotUsername }}</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body justify-content-end">
          <ul class="navbar-nav gap-2 flex-column flex-lg-row justify-content-end mt-2 mt-lg-0">
            <li class="nav-item">
              <button type="button" @click.prevent="() => router.replace({query: {}})" class="btn btn-outline-secondary">
                <FontAwesomeIcon :icon="faHouse" size="xs" />
                <span class="ms-2 d-inline d-lg-none">Домашняя страница</span>
              </button>
            </li>
            <li class="nav-item">
              <button type="button"
                      @click.prevent="() => router.replace({query: {...route.query, actions: 'post_add'}})"
                      class="btn btn-outline-success">
                <FontAwesomeIcon :icon="faSquarePlus"/>
                <span class="ms-2 d-inline d-lg-none">Новая команда</span>
              </button>
            </li>
            <li class="nav-item">
              <a href="https://calendar.yandex.ru/" target="_blank" class="btn btn-outline-secondary">
                <FontAwesomeIcon :icon="faCalendarDays"/>
                <span class="ms-2 d-inline d-lg-none">Календарь интервью</span>
              </a>
            </li>
            <li class="nav-item">
              <button type="button"
                      @click.prevent="() => router.replace({query: {...route.query, actions: 'contact'}})"
                      class="btn btn-outline-secondary">
                <FontAwesomeIcon :icon="faAddressCard"/>
                <span class="ms-2 d-inline d-lg-none">Контакты</span>
              </button>
            </li>
            <li :class="[offcanvasBodyShow ? 'position-absolute bottom-0 end-0 p-2' : 'nav-item']">
              <a v-if="auth.isLoggedIn" href="https://id.yandex.ru/" target="_blank" class="btn btn-outline-dark">
                <FontAwesomeIcon class="text-danger" :icon="faYandex"/>
                <span v-if="myself?.display_name" class="ms-1">{{ myself?.display_name }}</span>
                <span v-else class="placeholder-glow">
                  <span class="ms-2 placeholder bg-dark-subtle" style="width: 100px"></span>
                </span>
              </a>
              <button v-else type="button"
                      @click.prevent="() => router.replace({name: 'login.oauth2'})"
                      class="btn btn-outline-primary">
                <FontAwesomeIcon :icon="faArrowRightToBracket"/>
                <span class="ms-2">Войти</span>
              </button>
            </li>
            <li v-if="auth.isLoggedIn" :class="[offcanvasBodyShow ? 'position-absolute bottom-0 start-0 p-2' : 'nav-item']">
              <button type="button" @click.prevent="logout" class="btn btn-outline-primary">
                <span class="me-2" :class="{'d-none': ! offcanvasBodyShow}">Выход</span>
                <FontAwesomeIcon :icon="faArrowRightFromBracket"/>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.nav-item {
  > a,
  > button {
    min-width: 100% !important;
  }
}
</style>