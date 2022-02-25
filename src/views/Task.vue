<template>
    <div class="grid grid-rows-[1fr_auto] h-screen">
        <div>
            <div class="grid grid-cols-[auto_1fr_auto] gap-4 items-center p-4">
                <i @click="$router.back()" class="hero solid chevron-left clickable-bg -m-4 p-4 text-xl"></i>
                <div></div>
                <TaskOptionsPopup :task="task">
                    <template #default="{ open }">
                        <i @click="open" class="hero dots-vertical outline p-4 -m-4 clickable-bg rounded-full"></i>
                    </template>
                </TaskOptionsPopup>
            </div>
            <div class="grid grid-cols-[auto_1fr] gap-4 items-center mb-4 text-xl m-6 mt-4">
                <DoneCheckbox :value="task.done" @input="task.update({ done: $event })" borderClass="border-gray-500" />
                <input type="text" :value="task.title" @input="taskInput($event)" ref="input" />
            </div>
            <div class="py-8">
                <DeadlineIndicator :task="task" />
            </div>
        </div>
        <div>
            <TaskActions :task="task" class="p-4" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { DateTime } from 'luxon'
import { Task } from '../models/Task'
import { ref } from '@vue/reactivity'
import DoneCheckbox from '../components/DoneCheckbox.vue'
import Popup from '../components/Popup.vue'
import HorizontalScrolling from '../components/HorizontalScrolling.vue'
import Tag from '../components/Tag.vue'
import { asyncRef } from '../asyncRef'
import TaskOptionsPopup from '../components/TaskOptionsPopup.vue'
import DeadlinePickerPopup from '../components/DeadlinePickerPopup.vue'
import DeadlineIndicator from '../components/DeadlineIndicator.vue'
import TaskActions from '../components/TaskActions.vue'

const props = defineProps<{ id: number }>()
const input = ref<HTMLInputElement | null>(null)

const task = await asyncRef(() => Task.find(props.id))

async function taskInput(event: Event) {
    await task.value.update({
        title: (event.target as any)?.value,
    })
}
</script>
