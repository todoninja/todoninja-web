import { createApp } from 'vue'
import App from './App.vue'
import { List } from './models/List'
import { Task } from './models/Task'

createApp(App).mount('#app')

window.Task = Task
window.List = List
