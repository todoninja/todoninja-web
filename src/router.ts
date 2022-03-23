import { reactive } from 'vue'
import { createRouter, createWebHashHistory, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { clearPopupsOnInitialStart } from './use/backNavigatable'

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
    {
        path: '/backends',
        component: () => import('./views/Backends.vue'),
    },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

clearPopupsOnInitialStart()

export const history: RouteLocationNormalized[] = []
router.afterEach((to, from) => {
    const found = history.map((r) => r.fullPath).indexOf(to.fullPath)
    if (found >= 0) {
        history.splice(found)
    }
    history.push(to)
    console.log(
        'history',
        history.map((r) => r.fullPath)
    )
})

export const navigationInfo = reactive<{ direction: 'forward' | 'backward' | 'none' }>({
    direction: 'none',
})

router.beforeEach((to, from) => {
    const [todepth, fromdepth] = [to, from].map((route) => route.path.split('/').filter((value) => value).length)

    if (todepth > fromdepth) navigationInfo.direction = 'forward'
    else if (todepth < fromdepth) navigationInfo.direction = 'backward'
    else navigationInfo.direction = 'none'
})
