import { attribute, OpaqueModel, OpaqueTableInterface, OpaqueRow } from '@opaquejs/opaque'
import {
    AttributeOptionsContract,
    ModelAttributes,
    OpaqueAttributes,
} from '@opaquejs/opaque/lib/contracts/ModelContracts'
import { InMemoryAdapter } from '@opaquejs/opaque/lib/InMemoryAdapter'
import { QueryEngine } from '@opaquejs/query-engine'
import { DateTime } from 'luxon'
import { LocalStorageAdapter } from './adapters/LocalStorage'
import { vueModel } from './VueModel'

export class BaseModel extends vueModel(OpaqueModel) {}

export const localStorageAdapter = new LocalStorageAdapter(new QueryEngine())
export const inMemoryAdapter = new InMemoryAdapter(new QueryEngine())

export function instanceForSource<T extends OpaqueTableInterface>(cls: T) {
    cls.$instanceForSource = true
    const oldFromRow = cls.$fromRow
    cls.$fromRow = function (data?: OpaqueAttributes, options?: any) {
        if (data.__combined_source === true) {
            // @ts-ignore
            return data.model.$fromRow(data.attributes, options)
        }
        return oldFromRow.call(this, data, options)
    }
}

export const date = <Type>(options: Partial<AttributeOptionsContract<Type>> = {}) =>
    attribute({
        get: ((value: string) => (value ? DateTime.fromISO(value) : value)) as any,
        set: ((value: DateTime | null) => (value instanceof DateTime ? value.toISODate() : value)) as any,
    })
