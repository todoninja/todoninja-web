<template>
    <div class="mx-8 min-h-screen grid grid-rows-[auto_1fr] mb-32">
        <div
            class="grid grid-cols-[1fr_auto] sticky top-0 left-0 right-0 bg-gradient-to-b from-white via-white/20 to-white/20 backdrop-blur-md py-4 -mx-8 px-8 z-20"
        >
            <list-tabs :value="selectedListId" @input="selectedListId = $event" class="-ml-8 px-8 pr-16" />
            <account-popup class="z-10" />
        </div>
        <transition-group tag="div" name="flip-list" class="mt-4 grid grid-rows-[1fr_auto]">
            <transition-group name="flip-list" tag="div" key="overdueandnow">
                <task-item v-for="task of overdueTasks" :task="task" :key="task.id" />
                <div v-if="overdueTasks.length > 0" key="nowlabel" class="mb-2 text-sm mt-8 text-gray-500">Now</div>
                <task-item v-for="task of nowTasks" :key="task.id" :task="task" />
            </transition-group>
            <transition-group name="flip-list" tag="div" key="other">
                <div
                    v-if="groupedUpcomingTasks?.size > 0"
                    @click="showPostponed = !showPostponed"
                    class="mb-4"
                    key="upcomingtoggle"
                >
                    <div v-if="!showPostponed" class="flex flex-row items-center text-sm text-gray-500 mt-8 mb-8">
                        <i class="hero chevron-right solid mr-2"></i>
                        Show upcoming tasks
                    </div>
                    <div v-else class="flex flex-row items-center text-sm text-gray-500 mt-8">
                        <i class="hero chevron-down solid mr-2"></i>
                        Hide upcoming tasks
                    </div>
                </div>
                <template v-for="[index, group] of showPostponed ? groupedUpcomingTasks.entries() : []" :key="index">
                    <div class="mb-2 text-sm mt-8 text-gray-500">
                        {{
                            DateTime.fromISO(index).toLocaleString({
                                weekday: 'short',
                                month: 'short',
                                day: '2-digit',
                            })
                        }}
                    </div>
                    <task-item v-for="task of group" :key="task.id" :task="task" />
                </template>
                <div v-if="(doneTasks?.length || 0) > 0" @click="showDone = !showDone" class="mb-4" key="donetoggle">
                    <div v-if="!showDone" class="flex flex-row items-center text-sm text-gray-500 mt-8 mb-8">
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
        </transition-group>
        <task-creator-popup :task="newTask" v-slot="{ open }" @saved="newTaskSaved()">
            <div
                @click="newTaskClick(open)"
                class="fixed bottom-8 right-8 rounded h-12 w-12 bg-blue-100 text-blue-900 text-2xl flex flex-row items-center justify-center shadow-md"
            >
                <i class="hero plus outline"></i>
            </div>
        </task-creator-popup>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from '@vue/runtime-core'
import { definiteAsyncRef } from '../asyncRef'
import TaskItem from '../components/TaskItem.vue'
import { List } from '../models/List'
import ListTabs from '../components/ListTabs.vue'
import AccountPopup from '../components/AccountPopup.vue'
import { doneScope, nowScope, overdueScope, Task, upcomingScope } from '../models/Task'
import { groupBy } from '../helpers'
import { DateTime } from 'luxon'
import TaskCreatorPopup from '../components/TaskCreatorPopup.vue'

const selectedListId = ref(null)
const list = await definiteAsyncRef(async () => {
    if (selectedListId.value == null) {
        return List.default()
    }
    return (await List.find(selectedListId.value)) || List.default()
})
const nowTasks = await definiteAsyncRef(() => list.value.tasks().query().where(nowScope).get())
const upcomingTasks = await definiteAsyncRef(() =>
    list.value.tasks().query().where(upcomingScope).orderBy('postponedUntil', 'asc').get()
)
const overdueTasks = await definiteAsyncRef(() =>
    list.value.tasks().query().where(overdueScope).orderBy('deadlineAt', 'asc').get()
)
const doneTasks = await definiteAsyncRef(() => list.value.tasks().query().where(doneScope).get())

const groupedUpcomingTasks = computed(() => groupBy(upcomingTasks.value, (task) => task.postponedUntil!.toISODate()))
const showDone = ref(false)
const showPostponed = ref(false)
const newTask = ref(list.value.tasks().make())
function resetNewTask() {
    newTask.value = list.value.tasks().make()
}
function newTaskClick(opener: () => void) {
    if (list.value.id != newTask.value.listId) {
        resetNewTask()
    }
    opener()
}
function newTaskSaved() {
    resetNewTask()
}
</script>
