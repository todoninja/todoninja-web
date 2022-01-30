export class AutoMap<K, V> extends Map<K, V> {
    constructor(public resolver: (key: K) => V) {
        super()
    }
    get(key: K) {
        if (!this.has(key)) {
            this.set(key, this.resolver(key))
        }
        return super.get(key)!
    }
}
