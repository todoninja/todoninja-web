<template>
    <DeadlinePickerPopup v-slot="{ open }" :task="task">
        <div v-if="task.deadlineAt" class="flex flex-row items-center text-sm px-6 text-gray-400">
            <i
                class="hero flag solid"
                :class="{
                    'text-red-500': task.isOverdue(),
                    'text-blue-500': task.isToday(),
                }"
            ></i>
            <div class="flex-1 ml-4">
                Deadline <span v-if="!task.isToday()">at </span>
                <span
                    @click="open"
                    :class="{
                        'text-red-500': task.isOverdue(),
                        'text-blue-500': !task.isOverdue(),
                    }"
                    class="clickable"
                    >{{
                        task.isToday()
                            ? 'today'
                            : task.deadlineAt.toLocaleString({
                                  weekday: 'short',
                                  month: 'short',
                                  day: '2-digit',
                              })
                    }}</span
                >
            </div>
            <i @click="task.update({ deadlineAt: null })" class="hero solid x clickable-bg -m-4 p-4 rounded-full"></i>
        </div>
    </DeadlinePickerPopup>
</template>

<script lang="ts" setup>
import { Task } from '../models/Task'
import DeadlinePickerPopup from './DeadlinePickerPopup.vue'

defineProps<{ task: Task }>()
</script>
