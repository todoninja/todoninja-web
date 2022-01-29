import { QueryEngine } from '@opaquejs/query-engine'
import { NormalizedQuery } from '@opaquejs/query'
import { OpaqueAttributes, PrimaryKeyValue } from '@opaquejs/opaque/lib/contracts/ModelContracts'
import { AdapterInterface, OpaqueTableInterface } from '@opaquejs/opaque'
import { v4 } from 'uuid'

class Collection {
    map: Map<PrimaryKeyValue, OpaqueAttributes>
    constructor(public model: OpaqueTableInterface, public engine: QueryEngine) {
        this.map = new Map(JSON.parse(localStorage.getItem(model.name) || '[]'))
    }
    insertOrUpdate(items: OpaqueAttributes[]) {
        for (const item of items) {
            const pk = item[this.model.primaryKey] as PrimaryKeyValue
            if (!this.map.has(pk)) this.map.set(pk, {})
            Object.assign(this.map.get(pk), item)
        }
        localStorage.setItem(this.model.name, JSON.stringify([...this.map.entries()]))
    }

    query(query: NormalizedQuery) {
        return this.engine.queryCollection(Array.from(this.map.values()), query)
    }
}

class AutoMap<K, V> {
    map: Map<K, V> = new Map()
    constructor(public resolver: (key: K) => V) {}
    get(key: K) {
        if (!this.map.has(key)) {
            this.map.set(key, this.resolver(key))
        }
        return this.map.get(key)!
    }
}

export class LocalStorageAdapter implements AdapterInterface {
    public storage: AutoMap<OpaqueTableInterface, Collection>

    constructor(engine: QueryEngine) {
        this.storage = new AutoMap((key) => new Collection(key, engine))
    }

    async read(model: OpaqueTableInterface, query: NormalizedQuery) {
        return this.storage.get(model).query(query)
    }
    async insert(model: OpaqueTableInterface, data: OpaqueAttributes) {
        const pk = Math.floor(Math.random() * 1000000)
        this.storage.get(model).insertOrUpdate([{ ...data, [model.primaryKey]: pk }])
        return this.storage.get(model).map.get(pk)!
    }
    async update(model: OpaqueTableInterface, query: NormalizedQuery, data: OpaqueAttributes) {
        this.storage.get(model).insertOrUpdate(
            this.storage
                .get(model)
                .query(query)
                .map((item) => ({
                    [model.primaryKey]: item[model.primaryKey],
                    ...data,
                }))
        )
    }
    async delete(model: OpaqueTableInterface, query: NormalizedQuery) {
        this.storage
            .get(model)
            .query(query)
            .forEach((item) => this.storage.get(model).map.delete(item[model.primaryKey] as PrimaryKeyValue))
        localStorage.setItem(model.name, JSON.stringify([...this.storage.get(model).map.entries()]))
    }
}
