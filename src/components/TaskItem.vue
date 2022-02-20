<template>
    <div
        v-bind="$attrs"
        @click="$router.push(`/tasks/${task.id}`)"
        class="grid grid-cols-[auto_1fr_auto] gap-4 items-center py-2 -mx-8 px-8 clickable-bg"
    >
        <done-checkbox :value="task.done" @input="task.update({ done: $event })" />
        <div>
            {{ task.title }}
        </div>
        <div v-if="task.isOverdue()" class="text-red-500 flex flex-row items-center text-xs font-bold">
            <i class="hero flag solid mr-2"></i>
            {{ task.daysOverdue() }} {{ task.daysOverdue() > 1 ? 'days' : 'day' }} ago
        </div>
        <div v-if="task.isToday()" class="text-blue-500 flex flex-row items-center text-xs font-bold">
            <i class="hero flag solid mr-2"></i>
            Today
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Task } from '../models/Task'
import DoneCheckbox from './DoneCheckbox.vue'

const props = defineProps<{ task: Task }>()
</script>
