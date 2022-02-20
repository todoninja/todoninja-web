import { ref, Ref, watch, watchEffect } from 'vue'

export function asyncRef<Value>(value: () => Promise<Value>): Ref<Value | undefined>
export function asyncRef<Value>(value: () => Promise<Value>, defaultValue: Value): Ref<Value>
export function asyncRef<Value>(value: () => Promise<Value>, defaultValue?: Value) {
    const model = ref(defaultValue) as Ref<Value>
    watchEffect(() => value().then((m) => (model.value = m)))
    return model
}
export function definiteAsyncRef<Value>(value: () => Promise<Value>) {
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
