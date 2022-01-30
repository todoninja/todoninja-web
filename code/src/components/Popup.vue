<template>
    <slot name="trigger" :open="open"></slot>
    <teleport to="body">
        <transition name="popup-background">
            <div
                v-if="isOpen"
                @click.stop="close"
                class="fixed top-0 left-0 right-0 bottom-0 backdrop-blur-md z-50"
                style="background: linear-gradient(to bottom, rgb(255 255 255 / 1), rgb(0 0 0 / 0.1) 8rem)"
            ></div>
        </transition>
        <transition name="popup-content">
            <div
                v-if="isOpen"
                class="fixed left-4 right-4 bottom-4 p-8 rounded-lg bg-white shadow-md popup-content z-50"
                @click.stop
            >
                <slot name="content" :close="close"></slot>
            </div>
        </transition>
    </teleport>
</template>

<script lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, defineComponent, watch } from '@vue/runtime-core'
import { history } from '../router'

export default defineComponent({
    props: {
        id: {
            required: true,
            type: String,
        },
    },
    emits: ['open', 'close'],
    setup(props, context) {
        const router = useRouter()
        const isOpen = computed(() => router.currentRoute.value.query.popups?.includes(props.id) || false)
        watch(isOpen, (to, from) => {
            if (to && !from) context.emit('open')
            if (!to && from) context.emit('close')
        })
        const getLastRouteWithoutPopup = () => {
            for (const route of [...history].reverse()) {
                if (!route.query.popups?.includes(props.id)) {
                    return route
                }
            }
            return null
        }
        return {
            isOpen,
            open() {
                if (isOpen.value) return Promise.resolve()
                router.push({
                    ...router.currentRoute.value,
                    query: {
                        ...router.currentRoute.value.query,
                        popups: [...(router.currentRoute.value.query.popups || []), props.id],
                    },
                })
                return new Promise<void>((resolve) => setTimeout(() => resolve(), 150))
            },
            close() {
                if (!isOpen.value) return Promise.resolve()
                const lastWithout = getLastRouteWithoutPopup()
                const lastWithoutOffset = history.length - 1 - history.indexOf(lastWithout)
                router.go(-lastWithoutOffset)
                // return promise that resolves after the popup has disappeared
                return new Promise<void>((resolve) => setTimeout(() => resolve(), 150))
            },
        }
    },
})
</script>

<style></style>
