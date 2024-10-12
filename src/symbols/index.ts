import type {InjectionKey} from 'vue'
import {ContactsApi, PostsApi, UsersApi, DefaultApi} from '@openapi/api-client'


export const BotAPIsList = Symbol() as InjectionKey<{
    posts: PostsApi
    users: UsersApi
    contacts: ContactsApi
    defaults: DefaultApi
}>