<template>
    <div v-if="ready" class="mx-8 mb-32">
        <div
            class="grid grid-cols-[1fr_auto] sticky top-0 left-0 right-0 bg-gradient-to-b from-white via-white/20 to-white/20 backdrop-blur-md py-4 -mx-8 px-8 z-20"
        >
            <list-tabs :value="selectedListId" @input="selectedListId = $event" class="-ml-8 px-8 pr-16" />
            <account-popup class="z-10" />
        </div>
        <transition-group tag="div" class="max-w-2xl mx-auto mt-4" name="flip-list">
            <task-item v-for="task of nowTasks" :key="task.id" :task="task" />
            <new-task-item :list="list" key="new" />
            <div
                v-if="groupedPostponedTasks?.length > 0"
                @click="showPostponed = !showPostponed"
                class="mb-4"
                key="donetoggle"
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
            <div v-for="[index, group] of showPostponed ? groupedPostponedTasks : []" :key="index?.toISODate?.()">
                <div class="mb-2 text-sm mt-8 text-gray-500">
                    {{
                        index.toLocaleString({
                            weekday: 'short',
                            month: 'short',
                            day: '2-digit',
                        }) || 'now'
                    }}
                </div>
                <transition-group name="flip-list">
                    <task-item v-for="task of group" :key="task.id" :task="task" />
                </transition-group>
            </div>
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
    </div>
</template>

<script lang="ts">
import { computed, ref } from '@vue/runtime-core'
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

        return {
            nowTasks,
            doneTasks,
            showDone,
            showPostponed,
            groupedPostponedTasks,
            selectedListId,
            focused: focusedTask,
            list,
            ready: computed(() => list.value != undefined),
            log: (...args) => console.log(...args),
        }
    },
}
</script>
