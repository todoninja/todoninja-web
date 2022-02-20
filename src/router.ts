import { createRouter, createWebHashHistory, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('./views/Tasks.vue'),
    },
    {
        path: '/tasks/:id',
        component: () => import('./views/Task.vue'),
        props: (route) => ({ id: parseInt(route.params.id as string) }),
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

export const history: RouteLocationNormalized[] = []
router.afterEach((to, from) => {
    const found = history.map((r) => r.fullPath).indexOf(to.fullPath)
    if (found >= 0) {
        history.splice(found)
    }
    history.push(to)
    console.log(history.map((r) => r.fullPath))
})
