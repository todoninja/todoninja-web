import { attribute } from '@opaquejs/opaque'
import { HasManyRelationContract } from '@opaquejs/opaque/lib/contracts/ModelContracts'
import { reactive, ReactiveEffect, setTransitionHooks } from 'vue'
import { CombinedAdapter } from './adapters/CombinedAdapter'
import { BaseModel, inMemoryAdapter, instanceForSource, localStorageAdapter } from './Base'
import { InMemoryTask, LocalStorageTask, Task } from './Task'
import { ReactiveMap } from './VueModel'

export class List extends BaseModel {
    @attribute({ primaryKey: true })
    public id: number | null | undefined = undefined

    @attribute()
    public name: string = ''

    public tasks() {
        if (this instanceof LocalStorageList) {
            return this.hasMany(LocalStorageTask, { foreignKey: 'listId' }) as HasManyRelationContract<typeof Task>
        }
        if (this instanceof InMemoryList) {
            return this.hasMany(InMemoryTask, { foreignKey: 'listId' }) as HasManyRelationContract<typeof Task>
        }
        return this.hasMany(Task) as HasManyRelationContract<typeof Task>
    }

    public static default() {
        return LocalStorageList.make({ id: null, name: 'Default' })
    }

    public icon() {
        return (
            this.name.match(
                /^\p{Extended_Pictographic}(\u200D\p{Extended_Pictographic}\u200D\p{Extended_Pictographic})*/u
            )?.[0] || ''
        )
    }
    public nameWithoutIcon() {
        return this.name.slice(this.icon().length).trim()
    }

    public isDefault() {
        return this.id === null
    }
}

// Returns instances of the correct child class instead of the generic parent class
instanceForSource(List)

// Backend-specific classes for creation
export class LocalStorageList extends List {}
export class InMemoryList extends List {}

// Set the adapter outside, so we can use the backend-specific classes
List.adapter = new CombinedAdapter(
    new Map().set(LocalStorageList, localStorageAdapter).set(InMemoryList, inMemoryAdapter)
)

// Make reactive for vue
localStorageAdapter.storage.get(LocalStorageList).map = new ReactiveMap(
    localStorageAdapter.storage.get(LocalStorageList).map
)
inMemoryAdapter.storage.get(InMemoryList).map = new ReactiveMap(inMemoryAdapter.storage.get(InMemoryList).map)
