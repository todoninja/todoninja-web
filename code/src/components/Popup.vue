<template>
    <slot name="trigger" :open="open"></slot>
    <transition name="popup-background">
        <div
            v-if="state.open"
            @click.stop="close"
            class="fixed top-0 left-0 right-0 bottom-0 backdrop-blur-md bg-black/10 z-50"
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
</template>

<script lang="ts">
import { reactive } from '@vue/reactivity'

export default {
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
            },
        }
    },
}
</script>

<style></style>
