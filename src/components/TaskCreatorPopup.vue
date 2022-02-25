<template>
    <Popup bottom>
        <template #trigger="{ open }">
            <slot :open="() => open().then(() => input?.focus())"></slot>
        </template>
        <template #content="{ close }">
            <div class="flex flex-row items-center">
                <input
                    type="text"
                    :value="task.title"
                    @input="task.title = ($event.target as any).value"
                    @keydown.enter="save().then(close)"
                    ref="input"
                    placeholder="New Task..."
                    class="flex-1"
                />
                <i
                    @click="save().then(close)"
                    class="hero solid arrow-circle-up text-blue-500 rounded-full clickable-bg -m-4 p-4"
                ></i>
            </div>
            <TaskActions :task="task" class="mt-4 -mx-8 px-8" />
        </template>
    </Popup>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Task } from '../models/Task'
import Popup from './Popup.vue'
import TaskActions from './TaskActions.vue'

const props = defineProps<{ task: Task }>()
const emit = defineEmits<{
    (e: 'saved'): void
}>()

const input = ref<HTMLInputElement | null>(null)

function save() {
    return props.task.save().then(() => {
        emit('saved')
    })
}
</script>
