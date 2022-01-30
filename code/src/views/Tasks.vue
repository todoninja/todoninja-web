<template>
    <div v-if="ready" class="mx-8 mb-32">
        <div
            class="grid grid-cols-[1fr_auto] sticky top-0 left-0 right-0 bg-gradient-to-b from-white via-white/20 to-white/20 backdrop-blur-md py-4 -mx-8 px-8 z-20"
        >
            <list-tabs :value="selectedListId" @input="selectedListId = $event" class="-ml-8 px-8 pr-16" />
            <account-popup class="z-10" />
        </div>
        <transition-group tag="div" class="max-w-2xl mx-auto mt-4" name="flip-list">
            <task-item v-for="task of nowTasks" :key="task.id" :task="task" :ref="(el) => taskitems.set(task.id, el)" />
            <div
                v-if="groupedPostponedTasks?.length > 0"
                @click="showPostponed = !showPostponed"
                class="mb-4"
                key="upcomingtoggle"
            >
                <div v-if="!showPostponed" class="flex flex-row items-center text-sm text-gray-500 mt-8">
                    <i class="hero chevron-right solid mr-2"></i>
                    Show upcoming tasks
                </div>
                <div v-else class="flex flex-row items-center text-sm text-gray-500 mt-8">
                    <i class="hero chevron-down solid mr-2"></i>
                    Hide upcoming tasks
                </div>
            </div>
            <template v-for="[index, group] of showPostponed ? groupedPostponedTasks : []">
                <div class="mb-2 text-sm mt-8 text-gray-500" :key="index?.toISODate?.()">
                    {{
                        index.toLocaleString({
                            weekday: 'short',
                            month: 'short',
                            day: '2-digit',
                        })
                    }}
                </div>
                <task-item v-for="task of group" :key="task.id" :task="task" />
            </template>
            <div v-if="doneTasks?.length > 0" @click="showDone = !showDone" class="mb-4" key="donetoggle">
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
        <div
            @click="newTaskClick"
            class="fixed bottom-8 right-8 rounded h-12 w-12 bg-blue-100 text-blue-900 text-2xl flex flex-row items-center justify-center shadow-md"
        >
            <i class="hero plus outline"></i>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, nextTick, reactive, ref } from '@vue/runtime-core'
import { asyncRef } from '../asyncRef'
import TaskItem from '../components/TaskItem.vue'
import { focusedTask } from '../globals'
import { List } from '../models/List'
import NewTaskItem from '../components/NewTaskItem.vue'
import ListTabs from '../components/ListTabs.vue'
import Popup from '../components/Popup.vue'
import AccountPopup from '../components/AccountPopup.vue'
import { Task } from '../models/Task'
import { AutoMap } from '../helpers'
import { DateTime } from 'luxon'

const groupTasks = (tasks: Task[]) => {
    const grouped = new AutoMap<string, Task[]>(() => [])
    for (const task of tasks) {
        grouped.get(task.postponedUntil?.toISODate()).push(task)
    }
    return grouped
}

export default {
    components: {
        TaskItem,
        NewTaskItem,
        ListTabs,
        Popup,
        AccountPopup,
    },
    setup() {
        const selectedListId = ref(null)
        const list = asyncRef(async () => (await List.find(selectedListId.value)) || List.default())
        const nowTasks = asyncRef(
            async () => list.value?.tasks().query().where('done', false).andWhere('postponedUntil', null).get(),
            []
        )
        const postponedTasks = asyncRef(
            async () => list.value?.tasks().query().where('done', false).andWhere('postponedUntil', '!=', null).get(),
            []
        )
        const groupedPostponedTasks = computed(() =>
            Array.from(groupTasks(postponedTasks.value || []).entries())
                .sort()
                .map(([index, tasks]) => [index ? DateTime.fromISO(index) : 'now', tasks])
        )
        const doneTasks = asyncRef(async () => list.value?.tasks().query().where('done', true).get())
        const showDone = ref(false)
        const showPostponed = ref(false)
        const taskitems = new Map()

        console.log(taskitems)

        const focusTask = (id) => (taskitems.has(id) ? taskitems.get(id).focus() : setTimeout(() => focusTask(id), 0))

        return {
            nowTasks,
            doneTasks,
            showDone,
            showPostponed,
            groupedPostponedTasks,
            selectedListId,
            focused: focusedTask,
            taskitems,
            newTaskClick: async () => {
                const task = await list.value?.tasks().create({ title: '' })
                focusTask(task.id)
            },
            list,
            ready: computed(() => list.value != undefined),
            log: (...args) => console.log(...args),
        }
    },
}
</script>
