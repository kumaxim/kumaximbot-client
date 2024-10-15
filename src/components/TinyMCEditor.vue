<script setup lang="ts">
import {computed, onMounted} from 'vue'
import type {TinyMCE} from 'tinymce'

/**
 * The following import required for bundling TinyMCE via  ES6 and Vite
 *
 * @see https://www.tiny.cloud/docs/tinymce/latest/vite-es6-npm/
 * @see https://stackoverflow.com/questions/67425439/tinymce-vue-integration-selfhosted
 * @see https://stackoverflow.com/questions/66470164/how-to-use-tinymce-in-nuxt/71329883#71329883
 */

/* TinyMCE global */
import 'tinymce/tinymce'

/* Default icons are required. After that, import custom icons if applicable */
import 'tinymce/icons/default/icons.min.js'

/* Required TinyMCE components */
import 'tinymce/themes/silver/theme.min.js'
import 'tinymce/models/dom/model.min.js'

/* Import a skin (can be a custom skin instead of the default) */
import 'tinymce/skins/ui/oxide/skin.js'

/* Import plugins */
import 'tinymce/plugins/lists'
import 'tinymce/plugins/link'
import 'tinymce/plugins/image'
import 'tinymce/plugins/table'
import 'tinymce/plugins/code'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/fullscreen'

/* content UI CSS is required */
import 'tinymce/skins/ui/oxide/content.js'

/* The default content CSS can be changed or replaced with appropriate CSS for the editor content. */
import 'tinymce/skins/content/default/content.js'

import Editor from '@tinymce/tinymce-vue'

const props = defineProps<{
  text: string
  loading?: boolean
}>()

const emits = defineEmits<{
  'update:text': [string]
  'update:loading': [boolean]
}>()

const lazyText = computed({
  get() {
    return props.text
  },
  set(newValue) {
    emits('update:text', newValue)
  }
})

const lazyLoading = computed({
  get() {
    return props.loading
  },
  set(newValue) {
    emits('update:loading', newValue)
  }
})

const editorConfig: Parameters<TinyMCE['init']>[0] = {
  plugins: ['lists', 'link', 'image', 'table', 'code', 'charmap', 'preview', 'fullscreen'],
  toolbar: 'undo redo | fontsizeselect formatselect | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent blockquote | link image media fullscreen',
  license_key: 'gpl',
  branding: false,
}

onMounted(() => {
  // Using TinyMCE with the Bootstrap framework
  // @see https://www.tiny.cloud/docs/tinymce/latest/bootstrap-cloud/#usingtinymceinabootstrapdialog
  document.addEventListener('focusin', (event) => {
    if ((event.target as HTMLElement)?.closest(".tox-tinymce, .tox-tinymce-aux, .moxman-window, .tam-assetmanager-root")) {
      event.stopImmediatePropagation();
    }
  })
})
</script>

<template>
  <Editor api-key="no-api-key"
          v-model.trim="lazyText"
          :init="editorConfig"
          :disabled="lazyLoading"
          @init="lazyLoading = false"/>
</template>

<style scoped lang="scss">

</style>