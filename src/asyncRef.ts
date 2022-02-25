import { ref, Ref, watchEffect } from 'vue'

export function asyncRef<Value>(value: () => Promise<Value>) {
    const model = ref() as Ref<Value>
    let resolveSetPromise: (value: Ref<Value>) => void
    let resolved = false
    const setPromise = new Promise<Ref<Value>>((resolve) => (resolveSetPromise = resolve))
    watchEffect(() =>
        value().then((m) => {
            model.value = m
            if (!resolved) {
                resolveSetPromise(model)
                resolved = true
            }
        })
    )
    return setPromise
}
