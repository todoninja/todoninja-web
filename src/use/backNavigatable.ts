import { computed, getCurrentInstance, onUnmounted, watch } from 'vue'
import { RouteLocationNormalized, useRouter } from 'vue-router'
import { history, router } from '../router'

export function clearPopupsOnInitialStart() {
    const removeInitialHook = router.beforeEach((to) => {
        removeInitialHook()
        return { ...to, query: { ...to.query, popups: [] }, replace: true }
    })
}

function getPopupsInRoute({ query: { popups } }: RouteLocationNormalized) {
    if (popups == undefined) return []
    if (typeof popups == 'string') popups = [popups]

    return popups.filter((n) => typeof n === 'string').map((n) => parseInt(n!))
}

function getCurrentPopups() {
    return getPopupsInRoute(router.currentRoute.value)
}

export function useBackNavigatable() {
    const currentInstance = getCurrentInstance()
    if (!currentInstance) throw new Error('Popup needs instance!')
    const id: number = currentInstance.uid

    const router = useRouter()

    function getLastRouteWithout() {
        for (const route of [...history].reverse()) {
            if (!getPopupsInRoute(route).includes(id)) {
                return route
            }
        }
        return null
    }

    const isOpen = computed(() => getCurrentPopups().includes(id))

    function open() {
        if (isOpen.value) return true
        router.push({
            ...router.currentRoute.value,
            query: {
                ...router.currentRoute.value.query,
                popups: [...getCurrentPopups(), id],
            },
        })
    }

    function close() {
        if (!isOpen.value) return true
        const lastWithout = getLastRouteWithout()
        if (lastWithout == null) {
            router.replace({
                ...router.currentRoute.value,
                query: {
                    ...router.currentRoute.value.query,
                    popups: getCurrentPopups().filter((cid) => cid != id),
                },
            })
            return
        }
        const lastWithoutOffset = history.length - 1 - history.indexOf(lastWithout)
        router.go(-lastWithoutOffset)
    }

    onUnmounted(() => close())

    function onOpen(callback: () => void) {
        watch(isOpen, (to, from) => {
            if (to && !from) callback()
        })
    }
    function onClose(callback: () => void) {
        watch(isOpen, (to, from) => {
            if (!to && from) callback()
        })
    }

    return {
        id,
        isOpen,
        getLastRouteWithout,
        open,
        close,
        onOpen,
        onClose,
    }
}
