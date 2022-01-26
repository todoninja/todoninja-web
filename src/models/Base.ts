import { OpaqueModel, OpaqueTableInterface } from '@opaquejs/opaque'
import { OpaqueAttributes } from '@opaquejs/opaque/lib/contracts/ModelContracts'
import { InMemoryAdapter } from '@opaquejs/opaque/lib/InMemoryAdapter'
import { QueryEngine } from '@opaquejs/query-engine'
import { LocalStorageAdapter } from './adapters/LocalStorage'
import { vueModel } from './VueModel'

export class BaseModel extends vueModel(OpaqueModel) {}

export const localStorageAdapter = new LocalStorageAdapter(new QueryEngine())
export const inMemoryAdapter = new InMemoryAdapter(new QueryEngine())

export function instanceForSource<T extends OpaqueTableInterface>(cls: T) {
    const oldFromRow = cls.$fromRow
    cls.$fromRow = function (data?: OpaqueAttributes, options?: any) {
        if (data.__combined_source instanceof Function && data.__combined_source != this) {
            // @ts-ignore
            return data.__combined_source.$fromRow(data, options)
        }
        return oldFromRow.call(this, data, options)
    }
}
