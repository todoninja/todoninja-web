<template>
    <div v-if="ready" class="m-8 mt-0 mb-32">
        <horizontal-scrolling class="-mx-8">
            <div class="mt-8 mx-8 mb-16 flex flex-row items-center justify-center">
                <div
                    @click="currentList = list.id"
                    v-for="list of lists"
                    :key="list.id"
                    class="pl-4 py-2 pr-2 rounded font-semibold text-sm mr-2 flex flex-row items-center"
                    :class="{
                        'bg-blue-100 text-blue-900': list.id == currentList,
                        'text-gray-800': list.id != currentList,
                    }"
                >
                    <i class="hero light-bulb solid outline mr-2"></i>
                    <div class="whitespace-nowrap">{{ list.name }}</div>
                    <popup v-if="list.id == currentList">
                        <template v-slot:trigger="{ open }">
                            <i @click="open" class="hero dots-vertical solid text-xs text-blue-700 ml-2"></i>
                        </template>
                        <template v-slot:content> name </template>
                    </popup>
                </div>
                <popup @close="resetNewList">
                    <template v-slot:trigger="{ open }">
                        <i @click="open" class="hero plus solid text-gray-400 text-xl"></i>
                    </template>
                    <template v-slot:content="{ close }">
                        <label for="name" class="block text-sm font-medium text-slate-700"> Name </label>
                        <input
                            id="name"
                            type="text"
                            class="input-base mt-1"
                            v-model="newList.name"
                            autofocus
                            @keydown.enter="createListClick() && close()"
                        />
                        <label for="name" class="block text-sm font-medium text-slate-700"> Backend </label>
                        <select v-model="newList.backend" class="mt-1 input-base">
                            <option value="InMemory">In Memory</option>
                            <option value="LocalStorage">Local Storage</option>
                        </select>
                        <div class="flex flex-row items-center justify-end mt-4">
                            <div
                                @click="createListClick() && close()"
                                class="rounded bg-blue-100 text-blue-900 font-bold px-4 py-2 text-sm"
                            >
                                Save
                            </div>
                        </div>
                    </template>
                </popup>
            </div>
        </horizontal-scrolling>
        <transition-group tag="div" class="max-w-2xl mx-auto" name="flip-list">
            <task-item v-for="task of tasks" :key="task.id" :task="task" />
            <div key="new" class="grid grid-cols-[auto_1fr_auto] gap-4 items-center mb-4">
                <i
                    class="hero solid plus"
                    :class="{
                        'text-gray-500': focused != 'new',
                        'text-black': focused == 'new',
                    }"
                ></i>
                <input
                    type="text"
                    placeholder="New Task..."
                    v-model="newTask.title"
                    @focus="focused = 'new'"
                    @blur="timeout(() => (focused = 0), 0)"
                    @keyup.enter="createClick()"
                    class="peer"
                />
                <i
                    v-show="focused == 'new' && newTask.title.length > 0"
                    @click="resetNewTask()"
                    class="hero solid x text-gray-500"
                >
                </i>
            </div>
            <div v-if="doneTasks?.length > 0" @click="showDone = !showDone" class="mb-4" key="toggle">
                <div v-if="!showDone" class="flex flex-row items-center text-sm text-gray-500 mt-8">
                    <i class="hero chevron-right solid mr-2"></i>
                    Show done tasks
                </div>
                <div v-else class="flex flex-row items-center text-sm text-gray-500 mt-8">
                    <i class="hero chevron-down solid mr-2"></i>
                    Hide done tasks
                </div>
            </div>
            <task-item v-for="task of showDone ? doneTasks : []" :key="task.id" :task="task" />
        </transition-group>
    </div>
</template>

<script lang="ts">
import { computed, reactive, ref, watchEffect } from '@vue/runtime-core'
import { Task } from './models/Task'
import { asyncRef } from './asyncRef'
import TaskItem from './TaskItem.vue'
import { focusedTask } from './globals'
import { InMemoryList, List, LocalStorageList } from './models/List'
import Popup from './Popup.vue'
import HorizontalScrolling from './HorizontalScrolling.vue'

export default {
    components: {
        TaskItem,
        Popup,
        HorizontalScrolling,
    },
    setup() {
        const currentList = ref(null)
        const list = asyncRef(async () => (await List.find(currentList.value)) || List.default())
        const tasks = asyncRef(async () => list.value?.tasks().query().where('done', false).get())
        const doneTasks = asyncRef(async () => list.value?.tasks().query().where('done', true).get())
        const newTask = ref<Task | null>(null)
        watchEffect(() => (newTask.value = list.value?.tasks().make({})))
        const newList = reactive({ name: '', backend: 'LocalStorage' })
        const showDone = ref(false)
        const lists = asyncRef(async () => [List.default(), ...(await List.all())])

        return {
            tasks,
            newTask,
            doneTasks,
            showDone,
            currentList,
            lists,
            newList,
            focused: focusedTask,
            ready: computed(() => list.value != undefined),
            async createClick() {
                await newTask.value?.save()
                newTask.value = list.value?.tasks().make()
            },
            resetNewTask() {
                newTask.value = list.value?.tasks().make()
            },
            async createListClick() {
                const { backend, ...attrs } = newList
                if (backend == 'LocalStorage') {
                    await LocalStorageList.create(attrs)
                } else if (backend == 'InMemory') {
                    await InMemoryList.create(attrs)
                }
                newList.name = ''
            },
            async resetNewList() {
                newList.name = ''
            },
            timeout: (callback, time) => setTimeout(callback, time),
        }
    },
}
</script>
