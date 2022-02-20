<template>
    <Popup :id="`task-options-${task.id}`">
        <template #trigger="{ open }">
            <slot :open="open"></slot>
        </template>
        <template #content="{ close: closeOptions }">
            <div class="-my-4">
                <DeadlinePickerPopup v-slot="{ open }" :task="task" @change="closeOptions">
                    <div class="flex flex-row items-center text-gray-800 -mx-8 px-8 py-4 clickable-bg" @click="open">
                        <i class="hero flag solid text-red-500"></i>
                        <div class="ml-4">{{ task.deadlineAt ? 'Change' : 'Add' }} Deadline</div>
                    </div>
                </DeadlinePickerPopup>
                <Popup :id="`task-delete-${task.id}`">
                    <template #trigger="{ open }">
                        <div
                            class="flex flex-row items-center text-gray-800 -mx-8 px-8 py-4 clickable-bg"
                            @click="open"
                        >
                            <i class="hero trash solid"></i>
                            <div class="ml-4">Delete</div>
                        </div>
                    </template>
                    <template #content="{ close: closeConfirmation }">
                        Do you really want to delete the task "<b>{{ task.title }}</b
                        >"?
                        <div class="flex flex-row items-center justify-between mt-4">
                            <div
                                @click="closeConfirmation()"
                                class="rounded bg-gray-100 text-gray-900 font-bold px-4 py-2 text-sm"
                            >
                                Cancel
                            </div>
                            <div
                                @click="
                                    closeConfirmation()
                                        .then(() => closeOptions())
                                        .then(() => close())
                                        .then(() => deleteClick())
                                "
                                class="rounded bg-red-100 text-red-900 font-bold px-4 py-2 text-sm"
                            >
                                <i class="hero trash outline"></i>
                                Delete
                            </div>
                        </div>
                    </template>
                </Popup>
            </div>
        </template>
    </Popup>
</template>

<script setup lang="ts">
import { Task } from '../models/Task'
import Popup from './Popup.vue'
import { DateTime } from 'luxon'
import DatePickerPopup from './DatePickerPopup.vue'
import DeadlinePickerPopup from './DeadlinePickerPopup.vue'

const props = defineProps<{ task: Task }>()

function deleteClick() {
    return props.task.delete()
}
</script>
