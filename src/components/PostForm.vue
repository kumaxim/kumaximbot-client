<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from 'vue'
import {type TinyMCE} from 'tinymce'
import TinyMCEditor from '@tinymce/tinymce-vue'
import type {AxiosResponse, AxiosError} from 'axios'
import {Configuration, type Post, PostsApi} from '@openapi/api-client'
import {usePostStore} from '@/stores/posts'
import {useToastStore} from '@/stores/toasts'
import Modal from '@/components/twbs/Modal.vue'

const props = defineProps<{
  post_id?: number
}>()

const posts = usePostStore()
const toasts = useToastStore()

const loading = ref(true)

const is_open = ref<boolean | undefined>(true)
const is_remove = ref<boolean>(false)
const singlePost = ref<Post>({id: 0, command: '', title: '', text: ''})

const api = new PostsApi(new Configuration({
  basePath: import.meta.env.VITE_API_URL
}))

const editorConfig: Parameters<TinyMCE['init']>[0] = {
  plugins: ['lists', 'link', 'image', 'table', 'code', 'charmap', 'preview', 'fullscreen'],
  // toolbar: ['lists', 'link', 'image', 'fullscreen'].join(' '),
  toolbar: 'undo redo | fontsizeselect formatselect | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent blockquote | link image media fullscreen',
  license_key: 'gpl',
  branding: false,
}

onBeforeMount(async () => {
  if (props.post_id) {
    try {
      const {data} = await api.getPost(props.post_id)
      singlePost.value = data
    } catch (err: any) {
      if (err?.isAxiosError) {
        const {response} = err as AxiosError
        const {statusText, data} = response as AxiosResponse

        toasts.error(`${statusText}: ${data?.detail ?? JSON.stringify(data)}`)

        return
      }

      throw err
    } finally {
      // loading.value = false
    }
  }
})

onMounted(() => {
  // Using TinyMCE with the Bootstrap framework
  // @see https://www.tiny.cloud/docs/tinymce/latest/bootstrap-cloud/#usingtinymceinabootstrapdialog
  document.addEventListener('focusin', (event) => {
    if ((event.target as HTMLElement)?.closest(".tox-tinymce, .tox-tinymce-aux, .moxman-window, .tam-assetmanager-root")) {
      event.stopImmediatePropagation();
    }
  })
})

const create = async () => {
  const {data} = await api.createPost({...singlePost.value})

  is_open.value = undefined

  posts.insert(data)
  toasts.success(`Пост <span class="fw-bolder fst-italic">${data.command}</span> успешно добавлен`)
}

const update = async () => {
  if (! props?.post_id) {
    toasts.error('Невозможно обновить пост. Отсутствует параметр ?post_id')

    throw Error('Невозможно обновить пост. Отсутствует параметр ?post_id')
  }

  const {data} = await api.replacePost(props.post_id, {...singlePost.value})

  is_open.value = undefined

  posts.replace(data)
  toasts.success(`Пост <span class="fw-bolder fst-italic">${data.command}</span> успешно изменен`)
}

const post_submit = async () => {
  loading.value = true

  try {
    return props?.post_id ? await update() : await create()
  } catch (err: any) {
    if (err?.isAxiosError) {
      const {response} = err as AxiosError
      const {statusText, data} = response as AxiosResponse

      toasts.error(`${statusText}: ${data?.detail ?? JSON.stringify(data)}`)

      return
    }

    throw err
  } finally {
    loading.value = false
  }
}

const post_remove = async () => {
  if (! props?.post_id) {
    toasts.error('Невозможно удалить поиск. Отсутствует параметр ?post_id')

    throw Error('Невозможно удалить поиск. Отсутствует параметр ?post_id')
  }

  loading.value = true

  try {
    await api.deletePost(props.post_id)

    is_open.value = undefined

    posts.remove(singlePost.value)
    toasts.success(`Пост <span class="fw-bolder fst-italic">${singlePost.value.command}</span> успешно удален`)
  } catch (err: any) {
    if (err?.isAxiosError) {
      const {response} = err as AxiosError
      const {statusText, data} = response as AxiosResponse

      toasts.error(`${statusText}: ${data?.detail ?? JSON.stringify(data)}`)

      return
    }

    throw err
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Modal :show="!! is_open">
    <div v-if="!! is_remove" class="position-relative fs-5 text-center">
      <p class="border-bottom border-1 pb-3">
        Действительно удалить пост <span class="fw-bolder fst-italic">{{ singlePost.command }}</span>?
      </p>
      <div class="d-flex justify-content-between">
        <button type="button" @click.prevent="is_remove = false" class="btn btn-outline-secondary" :disabled="loading">
          Назад
        </button>
        <button type="button" @click.prevent="post_remove" class="btn btn-danger" :disabled="loading">
          <span v-show="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
          <span :class="{'ms-2': loading}" role="status">{{ loading ? 'Подождите...' : 'Удалить' }}</span>
        </button>
      </div>
    </div>
    <form v-else @submit.prevent="post_submit" @keyup.ctrl.enter="post_submit">
      <div class="mb-2">
        <label for="bot-command-label" class="form-label">Команда</label>
        <input type="text"
               v-model.trim="singlePost.command"
               class="form-control"
               id="bot-command-label"
               :disabled="loading">
      </div>
      <div class="mb-2">
        <label for="bot-callback-query-label" class="form-label">Callback Query</label>
        <input type="text"
               v-model.trim="singlePost.callback_query"
               class="form-control"
               id="bot-callback-query-label"
               :disabled="loading">
      </div>
      <div class="mb-2">
        <label for="bot-title-label" class="form-label">Заголовок</label>
        <input type="text"
               v-model.trim="singlePost.title"
               class="form-control"
               id="bot-title-label"
               :disabled="loading">
      </div>
      <div class="mb-2">
        <label for="bot-command-textarea" class="form-label">Содержание</label>
        <TinyMCEditor
            id="bot-command-textarea"
            api-key="no-api-key"
            v-model.trim="singlePost.text"
            tinymce-script-src="/node_modules/tinymce/tinymce.js"
            :init="editorConfig"
            :disabled="loading"
            @init="loading = false"
        />
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <button type="button"
                @click.prevent="is_remove = true"
                class="btn"
                :class="[post_id ? 'btn-outline-danger' : 'opacity-25']"
                :disabled="loading || (post_id === undefined)"> Удалить
        </button>
        <span class="flex-grow-1 text-end me-2 opacity-50 fst-italic">Ctrl + Enter</span>
        <button type="submit" class="btn btn-success" :disabled="loading">
          <span v-show="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
          <span :class="{'ms-2': loading}" role="status">
            {{ loading ? 'Подождите...' : (post_id ? 'Сохранить' : 'Добавить') }}
          </span>
        </button>
      </div>
    </form>
  </Modal>
</template>

<style scoped lang="scss">

</style>