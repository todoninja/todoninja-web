<template>
    <div class="min-h-screen">
        <div class="grid grid-cols-[auto_1fr_auto] gap-4 items-center p-4 bg-surface text-on-surface h-16">
            <i
                @click="$router.back()"
                class="hero outline arrow-left clickable-bg -m-4 p-4 text-lg text-on-surface"
            ></i>
            <div></div>
            <TaskOptionsMenu :task="task">
                <template #default="{ open }">
                    <i
                        @click="open($event)"
                        class="hero dots-vertical outline p-4 -m-4 clickable-bg rounded-full text-on-surface-variant"
                    ></i>
                </template>
            </TaskOptionsMenu>
        </div>
        <div class="grid grid-cols-[auto_1fr] gap-4 items-center text-xl p-4 bg-surface">
            <DoneCheckbox :value="task.done" @input="task.update({ done: $event })" />
            <input
                type="text"
                :value="task.title"
                @input="taskInput($event)"
                ref="input"
                class="bg-transparent w-full text-on-surface"
            />
        </div>
        <TaskActions :task="task" class="p-4 pt-2" />
        <div class="py-8">
            <DeadlineIndicator :task="task" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Task } from '../models/Task'
import { ref } from '@vue/reactivity'
import DoneCheckbox from '../components/DoneCheckbox.vue'
import { asyncRef } from '../asyncRef'
import TaskOptionsMenu from '../components/TaskMenu.vue'
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
