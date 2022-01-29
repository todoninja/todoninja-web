<template>
    <div v-if="ready" class="m-8 mb-32">
        <div class="grid grid-cols-[1fr_auto] pb-8">
            <list-tabs :value="selectedListId" @input="selectedListId = $event" class="-mx-8 px-8 pr-16" />
            <div class="z-10 flex flex-row items-stretch justify-start">
                <div class="bg-gradient-to-r from-transparent to-white w-8 via-white"></div>
                <div class="bg-white">
                    <popup>
                        <template v-slot:trigger="{ open }">
                            <div
                                @click="open"
                                class="bg-blue-100 rounded-full h-8 w-8 flex flex-row items-center justify-center"
                            >
                                <i class="hero user outline text-lg text-blue-500"></i>
                            </div>
                        </template>
                        <template v-slot:content>
                            <div class="flex flex-row items-center justify-start">
                                <div
                                    class="bg-blue-100 rounded-full h-10 w-10 flex flex-row items-center justify-center"
                                >
                                    <i class="hero user outline text-xl text-blue-500"></i>
                                </div>
                                <div class="ml-4">
                                    <div class="font-semibold">Account Name</div>
                                    <div class="text-sm text-gray-700">Account Subtitle</div>
                                </div>
                            </div>
                            <div class="border-t h-8 w-[calc(100%+8rem)] -mx-8 mt-8"></div>
                            <div class="flex flex-row items-center">
                                <i class="hero cog solid"></i>
                                <div class="ml-8">Settings</div>
                            </div>
                            <div class="border-t h-4 w-[calc(100%+8rem)] -mx-8 mt-8"></div>
                            <div class="flex flex-row items-center justify-center -mb-4 text-sm text-gray-700">
                                <a
                                    href="https://github.com/todoninja/todoninja-web"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Github
                                    <i class="hero external-link solid"></i>
                                </a>
                                <div class="mx-4">&bull;</div>
                                <router-link to="/privacypolicy" class="clickable">Privacy Policy</router-link>
                            </div>
                        </template>
                    </popup>
                </div>
            </div>
        </div>
        <transition-group tag="div" class="max-w-2xl mx-auto" name="flip-list">
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

export default {
    components: {
        TaskItem,
        NewTaskItem,
        ListTabs,
        Popup,
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
