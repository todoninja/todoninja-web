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
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
