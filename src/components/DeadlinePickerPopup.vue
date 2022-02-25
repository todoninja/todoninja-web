<template>
    <DatePickerPopup
        v-slot:default="{ open }"
        :value="task.deadlineAt"
        @input="
            (deadlineAt, close) => {
                task.update({ deadlineAt })
                close().then(() => $emit('change'))
            }
        "
    >
        <slot :open="open"></slot>
    </DatePickerPopup>
</template>

<script setup lang="ts">
import { Task } from '../models/Task'
import DatePickerPopup from './DatePickerPopup.vue'

defineProps<{ task: Task }>()
defineEmits<{
    (e: 'change'): void
}>()
</script>
