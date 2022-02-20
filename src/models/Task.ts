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

    @date()
    public deadlineAt: DateTime | null = null

    list() {
        return this.belongsTo(List)
    }

    daysOverdue(now: DateTime = DateTime.now()) {
        return -(this.deadlineAt?.startOf('day').diff(now.startOf('day'), 'days').days || 0)
    }
    isOverdue(now: DateTime = DateTime.now()) {
        return this.daysOverdue(now) > 0
    }
    isToday(now: DateTime = DateTime.now()) {
        return this.deadlineAt?.hasSame(now, 'day')
    }
}

export const doneScope = Task.scope((query) => query.where('done', true))
export const undoneScope = Task.scope((query) => query.where('done', false))
export const upcomingScope = Task.scope((query) =>
    query.where(undoneScope).andWhere('postponedUntil', '>', DateTime.now().endOf('day'))
)
export const overdueScope = Task.scope((query) =>
    query.where(undoneScope).andWhere('deadlineAt', '<', DateTime.now().startOf('day'))
)
export const nowScope = Task.scope((query) =>
    query
        .where(undoneScope)
        .andWhere((query) =>
            query.where('postponedUntil', null).orWhere('postponedUntil', '<=', DateTime.now().endOf('day'))
        )
        .andWhere((query) =>
            query.andWhere('deadlineAt', null).orWhere('deadlineAt', '>=', DateTime.now().startOf('day'))
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
