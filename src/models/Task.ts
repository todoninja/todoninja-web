import { attribute } from '@opaquejs/opaque'
import { BaseModel, date, inMemoryAdapter, instanceForSource, localStorageAdapter } from './Base'
import { List } from './List'
import { CombinedAdapter } from './adapters/CombinedAdapter'
import { ReactiveMap } from './VueModel'
import { DateTime } from 'luxon'

export class Task extends BaseModel {
    @attribute({ primaryKey: true })
    public id: string = ''

    @attribute()
    public title: string = ''

    @attribute()
    public done: boolean = false

    @attribute()
    public listId: number | null = null

    @date()
    public postponedUntil: DateTime | null = null

    list() {
        return this.belongsTo(List)
    }
}

export const doneScope = Task.scope((query) => query.where('done', true))
export const undoneScope = Task.scope((query) => query.where('done', false))
export const upcomingScope = Task.scope((query) =>
    query.where(undoneScope).andWhere('postponedUntil', '>', DateTime.now().endOf('day'))
)
export const nowScope = Task.scope((query) =>
    query
        .where(undoneScope)
        .andWhere((query) =>
            query.where('postponedUntil', null).orWhere('postponedUntil', '<=', DateTime.now().endOf('day'))
        )
)

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
