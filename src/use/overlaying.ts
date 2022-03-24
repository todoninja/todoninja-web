import { ref } from 'vue'

export const overlaying = ref<number>(0)

export function useOverlaying(opacity: number) {
    return {
        startOverlaying: () => {
            overlaying.value += opacity
        },
        stopOverlaying: () => {
            overlaying.value -= opacity
        },
    }
}
