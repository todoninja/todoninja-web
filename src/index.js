import { createApp } from 'vue'
import App from './App.vue'
import { InMemoryList, List, LocalStorageList } from './models/List'
import { InMemoryTask, LocalStorageTask, Task } from './models/Task'

createApp(App).mount('#app')

window.Task = Task
window.MTask = InMemoryTask
window.LTask = LocalStorageTask
window.LList = LocalStorageList
window.MList = InMemoryList
window.List = List
