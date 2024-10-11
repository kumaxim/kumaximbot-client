import {ref} from 'vue'
import {defineStore} from 'pinia'
import type {Post} from '@openapi/api-client'


export const usePostStore = defineStore('posts', () => {
    const posts = ref<Post[]>([])

    const insert = (post: Post) => {
        posts.value.push(post)
    }

    const replace = (post: Post) => {
        posts.value = posts.value.map(p => p.id === post.id ? post : p)
    }

    const remove = (post: Post) => {
        posts.value = posts.value.filter(p => p.id !== post.id)
    }

    const $reset = () => {
        posts.value .length= 0
    }

    return {insert, replace, remove, $reset, posts}
})
