<script setup lang="ts">
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {faArrowRightFromBracket, faSquarePlus, faHouse} from '@fortawesome/free-solid-svg-icons'
import {faCalendarDays} from '@fortawesome/free-regular-svg-icons'
import {faTelegramPlane} from '@fortawesome/free-brands-svg-icons'
import {Offcanvas} from 'bootstrap'
import {onBeforeUnmount, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {RouteActionList} from '@/router/actions'
import PostForm from '@/components/PostForm.vue'

const route = useRoute()
const router = useRouter()

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
</script>

<template>
  <PostForm v-if="route.query && route.query.actions?.includes(RouteActionList.ADD_POST)" />

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
            <span class="ms-2 fw-normal">@kumaximbot</span>
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
                      @click.prevent="() => router.replace({query: {...route.query, actions: RouteActionList.ADD_POST}})"
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
            <li :class="[offcanvasBodyShow ? 'position-absolute bottom-0 end-0 p-2' : 'nav-item']">
              <button type="button"
                      @click.prevent="() => router.replace({query: {...route.query, actions: RouteActionList.LOGIN}})"
                      class="btn btn-outline-primary">
                <FontAwesomeIcon :icon="faArrowRightFromBracket"/>
                <span class="ms-2">Войти</span>
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