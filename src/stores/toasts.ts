import {ref} from 'vue'
import {defineStore} from 'pinia'

interface Toast {
    id: number
    type: 'info' | 'success' | 'error'
    message: string
}

export const useToastStore = defineStore('toasts', () => {
    const toasts = ref<Toast[]>([])

    const append = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
        toasts.value.push({id: (toasts.value.length + 1), message, type})
    }

    const success = (message: string) => append(message, 'success')

    const error = (message: string) => append(message, 'error')

    const info = (message: string) => append(message, 'info')

    const remove = (id: number) => {
        toasts.value = toasts.value.filter((t) => t.id !== id)
    }

    return {append, info, success, error, remove, toasts}
})
