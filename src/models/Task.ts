import { attribute } from '@opaquejs/opaque'
import { reactive } from 'vue'
import { BaseModel, inMemoryAdapter, localStorageAdapter } from './Base'
import { List } from './List'
import { CombinedAdapter } from './adapters/CombinedAdapter'

export class Task extends BaseModel {
    @attribute({ primaryKey: true })
    public id: string

    @attribute()
    public title: string = ''

    @attribute()
    public done: boolean = false

    @attribute()
    public listId: number | undefined

    list() {
        return this.belongsTo(List)
    }
}
export class InMemoryTask extends Task {}
export class LocalStorageTask extends Task {}

Task.adapter = new CombinedAdapter(
    new Map().set(InMemoryTask, inMemoryAdapter).set(LocalStorageTask, localStorageAdapter)
)

inMemoryAdapter.storage.get(InMemoryTask).map = reactive(inMemoryAdapter.storage.get(InMemoryTask).map)
localStorageAdapter.storage.get(LocalStorageTask).map = reactive(localStorageAdapter.storage.get(LocalStorageTask).map)
