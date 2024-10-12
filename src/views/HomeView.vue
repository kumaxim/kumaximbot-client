<script setup lang="ts">
import {inject, onBeforeMount, onMounted, ref, watch, computed} from 'vue'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {faPenToSquare} from '@fortawesome/free-regular-svg-icons'
import {useRoute, useRouter} from 'vue-router'
import {BotAPIsList} from '@/symbols'
import {usePostStore} from '@/stores/posts'
import PostForm from '@/components/PostForm.vue'
import {postForm} from 'axios'

const router = useRouter()
const route = useRoute()

const apis = inject(BotAPIsList)

const loading = ref<boolean>(true)

const post_store = usePostStore()

const selected_id = ref<number>()

const needle_text = ref<string>()

const post_list = computed(() => {
  if (! needle_text.value || needle_text.value?.length < 3) {
    return post_store.posts
  }

  return post_store.posts.filter(p => {
    return p.command.includes(needle_text.value ?? '')
        || p.callback_query?.includes(needle_text.value ?? '')
        || p.title.includes(needle_text.value ?? '')
  })
})

const highlight_needle = (input: string) => {
  if (! needle_text.value || needle_text.value?.length < 3) {
    return input
  }

  return input.replace(
      new RegExp(needle_text.value, 'gi'),
      '<span class="bg-warning-subtle">' + needle_text.value + '</span>'
  )
}

onBeforeMount(async () => {
  if (route.query.actions && route.query?.post_id) {
    const post_id = Array.isArray(route.query?.post_id) ? route.query.post_id[0] : route.query.post_id
    selected_id.value = post_id ? parseInt(post_id) : undefined
  }

  post_store.$reset()
})

onMounted(async () => {
  loading.value = true

  try {
    const {data} = await apis!.posts.listPosts()
    data.forEach(p => post_store.insert(p))
  } finally {
    loading.value = false
  }
})

watch(selected_id, (value) => {
  if (value) {
    router.replace({query: {...route.query, actions: 'post_edit', post_id: value}})
  }
})

watch(() => route.query?.actions, (check) => {
  selected_id.value = check ? selected_id.value : undefined
})
</script>

<template>
  <PostForm v-if="selected_id && route.query.actions?.includes('post_edit')" v-model:post_id="selected_id"/>

  <div class="container">
    <form action="#" @submit.prevent="undefined" class="mt-4">
      <div class="input-group mb-3">
        <input type="text" v-model.trim="needle_text" class="form-control" placeholder="Команда" aria-label="Команда" aria-describedby="search-input">
        <button class="btn btn-outline-dark" type="submit" id="search-input" :disabled="!needle_text || needle_text?.length < 3">Искать</button>
      </div>
    </form>

    <main class="mt-4" role="main">
      <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        <template v-if="loading">
          <div v-for="idx in 12" :key="idx" class="col">
            <div class="card" aria-hidden="true">
              <div class="card-body">
                <h5 class="card-title placeholder-glow">
                  <span class="placeholder col-6"></span>
                </h5>
                <p class="card-text placeholder-glow">
                  <span class="placeholder col-7"></span>
                  <span class="placeholder col-4"></span>
                  <span class="placeholder col-4"></span>
                  <span class="placeholder col-6"></span>
                  <span class="placeholder col-8"></span>
                </p>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-if="post_list.length === 0" class="alert alert-warning w-100" role="alert">
            Ничего не найдено
          </div>
          <div v-for="post in post_list" :key="post.id" class="col">
            <div class="card">
              <div class="card-body position-relative">
                <div class="d-flex justify-content-between">
                  <div class="d-inline-flex flex-column mb-2">
                    <h5 class="card-title" v-html="highlight_needle(post.title)"></h5>
                    <h6 class="card-subtitle text-body-tertiary">
                      <span v-html="highlight_needle(post.command)"></span>
                      <span v-if="post.callback_query" v-html="'-> [' + highlight_needle(post.callback_query) + ']'"></span>
                    </h6>
                  </div>
                  <a href="#" @click.prevent="selected_id = post.id" class="stretched-link">
                    <FontAwesomeIcon :icon="faPenToSquare"/>
                  </a>
                </div>

                <p class="card-text text-truncate">{{ post.text.replace(/<[^>]*>/g, '') }}</p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
.stretched-link {
  color: var(--bs-success);

  &:hover {
    color: var(--bs-danger);
    background-color: transparent;

    &::after {
      background-color: hsla(160, 100%, 37%, 0.2);
    }
  }
}
</style>