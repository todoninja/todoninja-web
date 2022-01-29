import { attribute } from '@opaquejs/opaque'
import { BaseModel, inMemoryAdapter, instanceForSource, localStorageAdapter } from './Base'
import { List } from './List'
import { CombinedAdapter } from './adapters/CombinedAdapter'
import { ReactiveMap } from './VueModel'

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

instanceForSource(Task)

export class InMemoryTask extends Task {}
export class LocalStorageTask extends Task {}

Task.adapter = new CombinedAdapter(
    new Map().set(InMemoryTask, inMemoryAdapter).set(LocalStorageTask, localStorageAdapter)
)

inMemoryAdapter.storage.get(InMemoryTask).map = new ReactiveMap(inMemoryAdapter.storage.get(InMemoryTask).map)
localStorageAdapter.storage.get(LocalStorageTask).map = new ReactiveMap(
    localStorageAdapter.storage.get(LocalStorageTask).map
)
