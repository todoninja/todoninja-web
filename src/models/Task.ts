import { attribute } from '@opaquejs/opaque'
import { reactive } from 'vue'
import { BaseModel } from './Base'
import { List } from './List'

export class Task extends BaseModel {
    @attribute({ primaryKey: true })
    public id: number

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
Task.adapter.storage.get(Task).map = reactive(
    Task.adapter.storage.get(Task).map
)
