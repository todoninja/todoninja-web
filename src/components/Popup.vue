<template>
    <slot name="trigger" :open="open" :close="close"></slot>
    <teleport to="body">
        <transition name="popup-background">
            <div
                v-if="isOpen"
                @click.stop="close"
                class="fixed top-0 left-0 right-0 bottom-0 backdrop-blur-md z-50"
                style="background: linear-gradient(to bottom, rgb(255 255 255 / 1), rgb(0 0 0 / 0.2) 4rem)"
            ></div>
        </transition>
        <transition name="popup-content">
            <div
                v-if="isOpen"
                :class="{
                    'left-4 right-4 bottom-4 rounded-b-lg': !bottom,
                    'left-0 right-0 bottom-0': bottom,
                }"
                class="fixed p-8 rounded-t-lg bg-white shadow-md popup-content z-50 overflow-hidden"
                @click.stop
            >
                <slot name="content" :close="close"></slot>
            </div>
        </transition>
    </teleport>
</template>

<script lang="ts" setup>
import { RouteLocationNormalized, useRouter } from 'vue-router'
import { computed, onUnmounted, watch } from '@vue/runtime-core'
import { history } from '../router'
import { getCurrentInstance } from 'vue'

withDefaults(
    defineProps<{
        bottom?: boolean
    }>(),
    { bottom: false }
)
const emit = defineEmits<{
    (e: 'open'): void
    (e: 'close'): void
}>()

const currentInstance = getCurrentInstance()
if (!currentInstance) throw new Error('Popup needs instance!')
const id: number = currentInstance.uid

const router = useRouter()

const getCurrentPopups = () => getPopupsInRoute(router.currentRoute.value)
const isOpen = computed(() => getCurrentPopups().includes(id))

function getLastRouteWithoutPopup() {
    for (const route of [...history].reverse()) {
        if (!getPopupsInRoute(route).includes(id)) {
            return route
        }
    }
    return null
}
function getPopupsInRoute({ query: { popups } }: RouteLocationNormalized) {
    if (popups == undefined) return []
    if (typeof popups == 'string') popups = [popups]

    return popups.filter((n) => typeof n === 'string').map((n) => parseInt(n!))
}
function close() {
    if (!isOpen.value) return Promise.resolve()
    const lastWithout = getLastRouteWithoutPopup()
    if (lastWithout == null) {
        router.replace({
            ...router.currentRoute.value,
            query: {
                ...router.currentRoute.value.query,
                popups: getCurrentPopups().filter((id) => id != id),
            },
        })
        return new Promise<void>((resolve) => setTimeout(() => resolve(), 150))
    }
    const lastWithoutOffset = history.length - 1 - history.indexOf(lastWithout)
    router.go(-lastWithoutOffset)
    // return promise that resolves after the popup has disappeared
    return new Promise<void>((resolve) => setTimeout(() => resolve(), 150))
}
function open() {
    if (isOpen.value) return Promise.resolve()
    router.push({
        ...router.currentRoute.value,
        query: {
            ...router.currentRoute.value.query,
            popups: [...getCurrentPopups(), id],
        },
    })
    // return promise that resolves after the popup has disappeared
    return new Promise<void>((resolve) => setTimeout(() => resolve(), 150))
}

onUnmounted(() => close())
watch(isOpen, (to, from) => {
    if (to && !from) emit('open')
    if (!to && from) emit('close')
})

defineExpose({
    isOpen,
    open,
    close,
})
</script>

<style></style>
