import type {App} from 'vue'
import axios, {type AxiosError, type AxiosResponse} from 'axios'
import {BotAPIsList} from '@/symbols'
import {useAuthStore} from '@/stores/auth'
import {useToastStore} from '@/stores/toasts'
import {
    Configuration,
    ContactsApi,
    PostsApi,
    UsersApi
} from '@openapi/api-client'

export default {
    install: (app: App): void => {
        const auth = useAuthStore()
        const toasts = useToastStore()

        axios.interceptors.request.use((config) => {
            if (auth.isLoggedIn) {
                config.headers.set('Authorization', `Bearer ${auth.accessToken}`)
                config.headers.set('X-YID-Authorization', `Bearer ${auth.accessToken}`)
            }

            return config
        }, (error) => {
            const {message, code} = error as AxiosError
            toasts.error(`${code}: ${message ?? JSON.stringify(error)}`)

            return Promise.reject(error)
        })

        axios.interceptors.response.use((response) => response, (error: AxiosError) => {
            const {statusText, status, data} = error.response as AxiosResponse
            toasts.error(`[${status}] ${statusText}: ${data?.detail?.error ?? data?.detail ?? JSON.stringify(data)}`)

            return Promise.reject(error)
        })

        const config = new Configuration({
            basePath: import.meta.env.VITE_API_URL,
        })

        app.provide(BotAPIsList, {
            posts: new PostsApi(config),
            users: new UsersApi(config),
            contacts: new ContactsApi(config),
        })
    }
}
