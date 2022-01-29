import {
    createRouter,
    createWebHashHistory,
    createWebHistory,
    RouteLocationNormalized,
    RouteRecordRaw,
} from 'vue-router'

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('./views/Tasks.vue'),
    },
    {
        path: '/privacypolicy',
        component: () => import('./views/PrivacyPolicy.vue'),
    },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
