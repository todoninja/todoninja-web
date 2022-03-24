<template>
    <Dialog bottom>
        <template #trigger="{ open }">
            <slot :open="() => open().then(() => input?.focus())"></slot>
        </template>
        <template #content="{ close }">
            <div class="grid grid-cols-[1fr_auto]">
                <input
                    type="text"
                    :value="task.title"
                    @input="task.title = ($event.target as any).value"
                    @keydown.enter="save().then(close)"
                    ref="input"
                    placeholder="New Task..."
                    class="bg-transparent text-on-surface min-w-0 rounded px-2"
                />
                <TextButton @click="save().then(close)">Create</TextButton>
            </div>
            <TaskActions :task="task" class="mt-4 -mx-8 px-8" />
        </template>
    </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Task } from '../models/Task'
import Dialog from './Dialog.vue'
import TaskActions from './TaskActions.vue'
import TextButton from './TextButton.vue'

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
