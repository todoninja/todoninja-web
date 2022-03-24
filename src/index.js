import { createApp } from 'vue'
import App from './App.vue'
import { InMemoryList, List, LocalStorageList } from './models/List'
import { InMemoryTask, LocalStorageTask, Task } from './models/Task'
import { router } from './router'
import 'lit-datetime-picker'
import { DateTime } from 'luxon'
import { register } from 'register-service-worker'
import { hyphenate } from '@vue/shared'

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
window.DateTime = DateTime

function mixColors(one, two, opacity) {
    function torgb(hex) {
        const [_, one, two, three, four, five, six] = hex.split('')
        return [`${one}${two}`, `${three}${four}`, `${five}${six}`].map((hex) => parseInt(hex, 16))
    }

    function tohex(rgb) {
        return `#${rgb.map((value) => value.toString(16).split('.')[0].padStart(2, '0')).join('')}`
    }

    one = torgb(one)
    two = torgb(two)
    const both = [
        [one[0], two[0]],
        [one[1], two[1]],
        [one[2], two[2]],
    ]

    return tohex(both.map(([one, two]) => one * (1 - opacity) + two * opacity))
}

function maketints(surface, tint) {
    return [0.05, 0.08, 0.11, 0.12, 0.14].map((opacity) => mixColors(surface, tint, opacity))
}

console.log('mixed ', mixColors('#fffbfe', '#6750a4', 0.05))

if (import.meta.env.MODE === 'production') {
    register(`/service-worker.js`)
}
