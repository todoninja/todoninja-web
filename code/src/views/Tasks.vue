<template>
    <div v-if="ready" class="mx-8 mb-32">
        <div
            class="grid grid-cols-[1fr_auto] sticky top-0 left-0 right-0 bg-gradient-to-b from-white via-white/20 to-white/20 backdrop-blur-md py-4 -mx-8 px-8"
        >
            <list-tabs :value="selectedListId" @input="selectedListId = $event" class="-mx-8 px-8 pr-16" />
            <div class="z-10 flex flex-row items-stretch justify-start">
                <div class="bg-gradient-to-r from-transparent to-white w-8 via-white"></div>
                <div class="bg-white">
                    <account-popup />
                </div>
            </div>
        </div>
        <transition-group tag="div" class="max-w-2xl mx-auto mt-4" name="flip-list">
            <task-item v-for="task of tasks" :key="task.id" :task="task" />
            <new-task-item :list="list" key="new" />
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
import { computed, ref } from '@vue/runtime-core'
import { asyncRef } from '../asyncRef'
import TaskItem from '../components/TaskItem.vue'
import { focusedTask } from '../globals'
import { List } from '../models/List'
import NewTaskItem from '../components/NewTaskItem.vue'
import ListTabs from '../components/ListTabs.vue'
import Popup from '../components/Popup.vue'
import AccountPopup from '../components/AccountPopup.vue'

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
        const tasks = asyncRef(async () => list.value?.tasks().query().where('done', false).get())
        const doneTasks = asyncRef(async () => list.value?.tasks().query().where('done', true).get())
        const showDone = ref(false)

        return {
            tasks,
            doneTasks,
            showDone,
            selectedListId,
            focused: focusedTask,
            list,
            ready: computed(() => list.value != undefined),
            log: (...args) => console.log(...args),
        }
    },
}
</script>
