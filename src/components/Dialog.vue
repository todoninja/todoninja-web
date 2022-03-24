<template>
    <slot name="trigger" :open="open" :close="close"></slot>
    <teleport to="body">
        <transition name="popup-background">
            <div v-if="isOpen" class="fixed top-0 left-0 right-0 bottom-0 z-50 bg-black/20"></div>
        </transition>
        <transition :name="bottom ? 'popup-content-bottom' : 'popup-content'">
            <div
                v-if="isOpen"
                @click.stop="close()"
                class="fixed top-0 left-0 bottom-0 right-0 z-50 flex flex-col overscroll-contain"
                :class="{
                    'p-8 items-center justify-center': !bottom,
                    'items-stretch justify-end': bottom,
                }"
            >
                <div
                    :class="`${
                        bottom ? 'rounded-t-3xl' : 'rounded-3xl'
                    } p-6 bg-surface-3 text-on-surface overflow-hidden flex flex-col items-stretch justify-start`"
                    @click.stop
                >
                    <i v-if="icon" :class="`hero outline ${icon} text-secondary text-2xl self-center mb-4`"></i>
                    <div
                        v-if="$slots.title"
                        :class="`text-on-surface text-2xl ${$slots.icon ? 'text-center' : ''} mb-4`"
                    >
                        <slot name="title"></slot>
                    </div>
                    <div class="text-on-surface-variant text-sm">
                        <slot name="content" :close="close"></slot>
                    </div>
                    <div v-if="$slots.actions" class="flex flex-row items-center justify-end mt-8">
                        <slot name="actions" :close="close"></slot>
                    </div>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script lang="ts" setup>
import { useBackNavigatable } from '../use/backNavigatable'

defineProps<{
    icon?: string
    bottom?: boolean
}>()
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
    opacity: 0%;
    transform: scale(80%);
}
.popup-content-leave-to {
    @apply opacity-0;
}
.popup-content-bottom-enter-active,
.popup-content-bottom-leave-active {
    @apply transition-all;
}
.popup-content-bottom-enter-from {
    opacity: 0%;
    transform: translateY(2rem);
}
.popup-content-bottom-leave-to {
    @apply opacity-0;
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
