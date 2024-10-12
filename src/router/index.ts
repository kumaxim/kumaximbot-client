import { createRouter, createWebHistory } from 'vue-router'
import {inject} from 'vue'
import {BotAPIsList} from '@/symbols'
import {useAuthStore} from '@/stores/auth'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: async (to) => {
        const auth = useAuthStore()
        const {code, state} = to.query

        if (code && state) {
          const apis = inject(BotAPIsList)
          const {data: token} = await apis!.users.getOAuthToken({
            code: code as string,
            state: state as string
          })

          auth.setToken(token)

          return {...to, query: {}}
        }
      }
    },
    {
      path: '/login/oauth2',
      name: 'login.oauth2',
      redirect() {
        window.location.href = `${import.meta.env.VITE_API_URL}/users/login/redirect`

        return {}
      }
    },
    {
      path: '/login',
      name: 'login',
      redirect(to) {
        return {name: 'home', query: to.query}
      },
    },
    {
      path: '/profile',
      name: 'profile',
      redirect() {
        window.location.href = 'https://id.yandex.ru/'

        return {}
      }
    },
  ]
})

export default router
