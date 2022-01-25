import { shallowReactive } from 'vue'

export class AutoMap<K, V> {
    protected map: Map<K, V> = shallowReactive(new Map())
    constructor(protected resolver: (key: K) => V) {}
    get(key: K) {
        if (!this.map.has(key)) {
            this.map.set(key, this.resolver(key))
        }
        return this.map.get(key)!
    }
    reset(key: K) {
        this.map.set(key, this.resolver(key))
    }
}
