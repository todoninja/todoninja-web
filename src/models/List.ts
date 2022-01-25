import { attribute } from '@opaquejs/opaque'
import { reactive } from 'vue'
import { BaseModel } from './Base'
import { Task } from './Task'

export class List extends BaseModel {
    @attribute({ primaryKey: true })
    public id: number

    @attribute()
    public name: string = ''

    public tasks() {
        return this.hasMany(Task)
    }

    public static default() {
        return List.make({ id: null, name: 'Default' })
    }
}
List.adapter.storage.get(List).map = reactive(
    List.adapter.storage.get(List).map
)
