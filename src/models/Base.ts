import { OpaqueModel } from '@opaquejs/opaque'
import { QueryEngine } from '@opaquejs/query-engine'
import { LocalStorageAdapter } from './adapters/LocalStorage'
import { vueModel } from './VueModel'

export class BaseModel extends vueModel(OpaqueModel) {
    static adapter = new LocalStorageAdapter(new QueryEngine())
}
