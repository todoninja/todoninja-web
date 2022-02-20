<template>
    <Popup :id="id">
        <template #trigger="{ open, close }">
            <slot :open="open" :close="close"></slot>
        </template>
        <template #content="{ close }">
            <lit-datetime-picker-calendar
                startOfWeek="1"
                @input=" (e: {detail: Date}) => $emit('input', DateTime.fromJSDate(e.detail), close) "
                :value="value?.toJSDate()"
            ></lit-datetime-picker-calendar>
        </template>
    </Popup>
</template>

<script lang="ts" setup>
import Popup from './Popup.vue'
import { DateTime } from 'luxon'

defineProps<{ value: DateTime | null; id: string }>()
defineEmits<{
    (e: 'input', datetime: DateTime, close: () => Promise<void>): void
}>()
</script>
