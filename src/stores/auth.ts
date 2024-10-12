import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import type {OAuth2Token} from '@openapi/api-client'

const LOCAL_STORAGE_AUTH_KEY = 'oauth'
const oauthTokens = window.localStorage.getItem(LOCAL_STORAGE_AUTH_KEY)

export const useAuthStore = defineStore('auth', () => {
    const token = ref<OAuth2Token | undefined>(oauthTokens ? JSON.parse(oauthTokens) : undefined)

    const setToken = (value: OAuth2Token) => {
        window.localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(value))
        token.value = value
    }

    const clearToken = () => {
        window.localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY)
        token.value = undefined
    }

    return {
        accessToken: computed(() => token.value?.access_token),
        refreshToken: computed(() => token.value?.refresh_token),
        expiresIn: computed(() => token.value?.expires_in),
        isLoggedIn: computed(() => !! token.value?.access_token && !! token.value?.expires_in),
        setToken,
        clearToken
    }
})
