import { OpaqueAttributes, OpaqueRowInterface } from '@opaquejs/opaque/lib/contracts/ModelContracts'
import { watch, reactive, markRaw, isReactive } from 'vue'

export class ReactiveMap<K, V extends object> extends Map<K, V> {
    constructor(map: Map<K, V>) {
        super(map)
        return reactive(this)
    }

    set(key: K, value: V) {
        super.set(key, reactive(value) as V)
        return this
    }
}

const deserialized = new Map<OpaqueAttributes, OpaqueAttributes>()

interface VueModellable {
    new (...args: any[]): OpaqueRowInterface
    $deserialize: (data: OpaqueAttributes) => OpaqueAttributes
}

export const vueModel = <T extends VueModellable>(base: T): T =>
    class VueReactiveModel extends base {
        // public static $deserialized: Map<OpaqueAttributes, OpaqueAttributes> = new Map()
        constructor(...args: any[]) {
            super(...args)
            this.$ensureReactivity()
            markRaw(this)
        }

        static $deserialize(data: OpaqueAttributes) {
            if (!isReactive(data)) {
                // @ts-ignore
                return super.$deserialize(data)
            }
            if (!deserialized.has(data)) {
                deserialized.set(data, reactive({}))
                // @ts-ignore
                watch(data, (value) => Object.assign(deserialized.get(data), super.$deserialize(data)), {
                    immediate: true,
                })
            }
            return deserialized.get(data)
        }
        $ensureReactivity(): this {
            this.$attributes.chain = reactive(this.$attributes.chain)
            return this
        }
    }
