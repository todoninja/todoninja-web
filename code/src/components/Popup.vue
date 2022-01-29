<template>
    <slot name="trigger" :open="open"></slot>
    <teleport to="body">
        <transition name="popup-background">
            <div
                v-if="state.open"
                @click.stop="close"
                class="fixed top-0 left-0 right-0 bottom-0 backdrop-blur-md z-50"
                style="background: linear-gradient(to bottom, rgb(255 255 255 / 1), rgb(0 0 0 / 0.1) 8rem)"
            ></div>
        </transition>
        <transition name="popup-content">
            <div
                v-if="state.open"
                class="fixed left-4 right-4 bottom-4 p-8 rounded-lg bg-white shadow-md popup-content z-50"
                @click.stop
            >
                <slot name="content" :close="close"></slot>
            </div>
        </transition>
    </teleport>
</template>

<script lang="ts">
import { reactive } from '@vue/reactivity'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
    emits: ['open', 'close'],
    setup(props, context) {
        const state = reactive({
            open: false,
        })
        return {
            state,
            open() {
                state.open = true
                context.emit('open')
            },
            close() {
                state.open = false
                context.emit('close')
                // return promise that resolves after the popup has disappeared
                return new Promise<void>((resolve) => setTimeout(() => resolve(), 150))
            },
        }
    },
})
</script>

<style></style>
