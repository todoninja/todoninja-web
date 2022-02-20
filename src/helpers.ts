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

export function groupBy<T>(items: T[], callback: (item: T) => string) {
    const grouped = new AutoMap<string, T[]>(() => [])
    for (const item of items) {
        grouped.get(callback(item)).push(item)
    }
    return new Map(grouped)
}

export function sleep(ms: number) {
    return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), ms)
    })
}
