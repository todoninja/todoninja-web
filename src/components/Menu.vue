<template>
    <slot name="trigger" :open="open" :close="close"></slot>
    <teleport to="body">
        <div v-if="isOpen" @click.stop="close()" class="fixed top-0 left-0 right-0 bottom-0 z-50"></div>
        <transition name="popup-content">
            <div
                v-if="isOpen"
                class="fixed z-50 flex flex-col items-stretch bg-surface-2 shadow-md rounded py-2 min-w-[112px] max-w-[280px]"
                :style="`top: ${position.top}px; right: max(1rem, ${position.right}px)`"
            >
                <slot name="content" :close="close"></slot>
            </div>
        </transition>
    </teleport>
</template>

<script lang="ts" setup>
import { useBackNavigatable } from '../use/backNavigatable'

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
const position = { top: 0, right: 0 }
function open(event: MouseEvent) {
    if (!event.target || !(event.target instanceof HTMLElement)) {
        throw new Error('Target of event not available. Modal cannot be opened.')
    }
    position.top = event.target.offsetTop + event.target.offsetHeight
    position.right = document.documentElement.clientWidth - event.target.offsetLeft - event.target.offsetWidth
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
    opacity: 0%;
    transform: scale(80%);
}
.popup-content-leave-to {
    @apply opacity-0;
}
</style>
