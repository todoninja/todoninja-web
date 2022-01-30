import { attribute, OpaqueModel, OpaqueTableInterface, OpaqueTable } from '@opaquejs/opaque'
import {
    AttributeOptionsContract,
    ModelAttributes,
    OpaqueAttributes,
} from '@opaquejs/opaque/lib/contracts/ModelContracts'
import { InMemoryAdapter } from '@opaquejs/opaque/lib/InMemoryAdapter'
import { QueryEngine } from '@opaquejs/query-engine'
import { ComparisonTypes } from '@opaquejs/query'
import { DateTime } from 'luxon'
import { LocalStorageAdapter } from './adapters/LocalStorage'
import { vueModel } from './VueModel'
import { DateTimeComparator } from './extensions/DateTimeComparator'
import { QueryBuilderModifier, QueryBuilderContract } from '@opaquejs/opaque/lib/contracts/QueryBuilderContracts'

export class BaseModel extends vueModel(OpaqueModel) {
    update(data: Partial<ModelAttributes<this>>): Promise<this> {
        return this.$setAndSaveAttributes(data)
    }
    static scope<This extends OpaqueTable>(this: This, modifier: QueryBuilderModifier<QueryBuilderContract<This>>) {
        return modifier
    }
}

export const queryEngine = new QueryEngine({
    comparators: {
        postponedUntil: (ctx) => new DateTimeComparator(ctx),
    },
})

// export const localStorageAdapter = new LocalStorageAdapter(model => new AutoMap(model => new Backend()).get(model))
export const localStorageAdapter = new LocalStorageAdapter(queryEngine)
export const inMemoryAdapter = new InMemoryAdapter(queryEngine)

export function instanceForSource<T extends OpaqueTableInterface>(cls: T) {
    cls.$instanceForSource = true
    const oldFromRow = cls.$fromRow
    cls.$fromRow = function (data?: OpaqueAttributes) {
        if (data?.__combined_source === true) {
            // @ts-ignore
            return data.model.$fromRow(data.attributes)
        }
        return oldFromRow.call(this, data)
    }
}

export const date = <Type>(options: Partial<AttributeOptionsContract<Type>> = {}) =>
    attribute({
        get: ((value: string) => (value ? DateTime.fromISO(value) : value)) as any,
        set: ((value: DateTime | null) => (value instanceof DateTime ? value.toISODate() : value)) as any,
    })
