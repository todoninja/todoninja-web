<template>
    <slot name="trigger" :open="open" :close="close"></slot>
    <teleport to="body">
        <transition name="popup-background">
            <div v-if="isOpen" @click.stop="close()" class="fixed top-0 left-0 right-0 bottom-0 z-50 bg-black/40"></div>
        </transition>
        <transition name="popup-content">
            <div
                v-if="isOpen"
                @click.stop
                class="fixed top-0 left-0 bottom-0 z-50 bg-surface-1 px-3 pt-8 min-w-[17rem] rounded-r-3xl"
            >
                <div class="text-on-surface-variant font-medium text-sm pl-4 mb-4">Parchment</div>
                <naivgation-drawer-item title="Entry" icon="inbox" />
                <naivgation-drawer-item active title="Outbox" icon="paper-airplane" />
            </div>
        </transition>
    </teleport>
</template>

<script lang="ts" setup>
import { useBackNavigatable } from '../use/backNavigatable'
import NaivgationDrawerItem from './NaivgationDrawerItem.vue'

const emit = defineEmits<{
    (e: 'open'): void
    (e: 'close'): void
}>()

const { isOpen, open: openBack, close: closeBack, onOpen, onClose } = useBackNavigatable()

onOpen(() => emit('open'))
onClose(() => emit('close'))

function close() {
    return closeBack()
        ? Promise.resolve()
        : // return promise that resolves after the popup has disappeared
          new Promise<void>((resolve) => setTimeout(() => resolve(), 150))
}
function open() {
    return openBack()
        ? Promise.resolve()
        : // return promise that resolves after the popup has disappeared
          new Promise<void>((resolve) => setTimeout(() => resolve(), 150))
}

defineExpose({
    isOpen,
    open,
    close,
})
</script>

<style scoped>
.popup-content-enter-active,
.popup-content-leave-active {
    @apply transition-all;
}
.popup-content-enter-from {
    transform: translateX(-20rem);
}
.popup-content-leave-to {
    transform: translateX(-20rem);
}

.popup-background-enter-active,
.popup-background-leave-active {
    @apply transition-opacity;
}
.popup-background-enter-from,
.popup-background-leave-to {
    opacity: 0;
}
</style>
