import { getCurrentInstance } from 'vue'
export function makeIncrementingIdGenerator() {
    let id = 0
    return () => id++
}
