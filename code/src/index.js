import { createApp } from 'vue'
import App from './App.vue'
import { InMemoryList, List, LocalStorageList } from './models/List'
import { InMemoryTask, LocalStorageTask, Task } from './models/Task'
import { router } from './router'
import 'lit-datetime-picker'

createApp(App)
    .use(router)
    .directive('longpressable', {
        mounted(el) {
            let timer = null
            el.addEventListener('touchstart', function (event) {
                timer = setTimeout(() => {
                    el.dispatchEvent(new CustomEvent('longpress'))
                }, 500)
            })
            el.addEventListener('touchend', function (event) {
                if (timer) {
                    clearTimeout(timer)
                }
                timer = null
            })
            el.addEventListener('touchcancel', function () {
                if (timer) clearTimeout(timer)
                timer = null
            })
            el.addEventListener('touchmove', function () {
                if (timer) clearTimeout(timer)
                timer = null
            })
        },
    })
    .mount('#app')

window.Task = Task
window.MTask = InMemoryTask
window.LTask = LocalStorageTask
window.LList = LocalStorageList
window.MList = InMemoryList
window.List = List
