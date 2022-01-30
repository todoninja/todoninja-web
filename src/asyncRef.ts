import { ref, Ref, watchEffect } from 'vue'

export function asyncRef<Value>(value: () => Promise<Value>): Ref<Value | undefined>
export function asyncRef<Value>(value: () => Promise<Value>, defaultValue: Value): Ref<Value>
export function asyncRef<Value>(value: () => Promise<Value>, defaultValue?: Value) {
    const model = ref(defaultValue) as Ref<Value>
    watchEffect(() => value().then((m) => (model.value = m)))
    return model
}

asyncRef(async () => 'hello')
