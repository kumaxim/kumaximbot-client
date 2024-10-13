import { fileURLToPath, URL } from 'node:url'
import {resolve} from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), mkcert()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@openapi': fileURLToPath(new URL('./openapi', import.meta.url)),
      '~bootstrap': resolve(__dirname, 'node_modules/bootstrap'),
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('fortawesome')) {
            return 'icons'
          }

          if (id.includes('tinymce/tinymce')) {
            return 'tinymce/index'
          }

          if (id.includes('tinymce/plugins')) {
            return 'tinymce/plugins'
          }

          if (id.includes('tinymce/themes')){
            return 'tinymce/themes'
          }
        }
      }
    }
  }
})
