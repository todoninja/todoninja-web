<template>
    <div>
        <popup ref="popup" :id="`task-detail-${task.id}`">
            <template v-slot:trigger="{ open }">
                <div
                    v-bind="$attrs"
                    @click="open"
                    class="grid grid-cols-[auto_1fr_auto] gap-4 items-center py-2 -mx-8 px-8 clickable-bg"
                >
                    <done-checkbox :value="task.done" @input="task.update({ done: $event })" />
                    <div>
                        {{ task.title }}
                    </div>
                </div>
            </template>
            <template v-slot:content="{ close }">
                <div class="grid grid-cols-[auto_1fr_auto] gap-4 items-center mb-4">
                    <done-checkbox :value="task.done" @input="task.update({ done: $event })" />
                    <input
                        type="text"
                        :value="task.title"
                        @focus="focused = task.id"
                        @input="taskInput($event)"
                        @keyup.enter="close()"
                        ref="input"
                    />
                    <popup :id="`task-options-${task.id}`">
                        <template v-slot:trigger="{ open }">
                            <i @click="open" class="hero dots-vertical outline p-4 -m-4 clickable-bg rounded-full"></i>
                        </template>
                        <template v-slot:content="{ close: closeOptions }">
                            <div class="-my-4">
                                <popup :id="`task-delete-${task.id}`">
                                    <template v-slot:trigger="{ open }">
                                        <div
                                            class="flex flex-row items-center text-red-500 -mx-8 px-8 py-4 clickable-bg"
                                            @click="open"
                                        >
                                            <i class="hero trash solid"></i>
                                            <div class="ml-8">Delete</div>
                                        </div>
                                    </template>
                                    <template v-slot:content="{ close: closeConfirmation }">
                                        Do you really want to delete the task "<b>{{ task.title }}</b
                                        >"?
                                        <div class="flex flex-row items-center justify-between mt-4">
                                            <div
                                                @click="close()"
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
                                </popup>
                            </div>
                        </template>
                    </popup>
                </div>
                <div class="flex flex-row items-center mt-4">
                    <popup :id="`task-detail-${task.id}-postpone-picker`">
                        <template v-slot:trigger="{ open }">
                            <div
                                @click="open"
                                class="rounded-full border px-3 py-1 text-sm flex flex-row items-center clickable-bg"
                            >
                                <i class="hero chevron-double-right text-blue-500 outline mr-2"></i>
                                <div v-if="task.postponedUntil">
                                    Postponed until
                                    {{
                                        task.postponedUntil.toLocaleString({
                                            weekday: 'short',
                                            month: 'short',
                                            day: '2-digit',
                                        })
                                    }}
                                </div>
                                <i
                                    @click.stop="task.$setAndSaveAttributes({ postponedUntil: undefined })"
                                    v-if="task.postponedUntil"
                                    class="hero x solid p-2 -my-2 ml-0 -mr-3"
                                ></i>
                                <div v-else>Postpone</div>
                            </div>
                        </template>
                        <template v-slot:content="{ close }">
                            <lit-datetime-picker-calendar
                                startOfWeek="1"
                                @input="
                                    task.$setAndSaveAttributes({ postponedUntil: parseDate($event.detail) }).then(() =>
                                        close()
                                    )
                                "
                            ></lit-datetime-picker-calendar>
                        </template>
                    </popup>
                </div>
            </template>
        </popup>
    </div>
</template>

<script lang="ts">
import { DateTime } from 'luxon'
import { focusedTask } from '../globals'
import { Task } from '../models/Task'
import Popup from './Popup.vue'
import { ref } from '@vue/reactivity'
import DoneCheckbox from './DoneCheckbox.vue'
export default {
    components: { Popup, DoneCheckbox },
    props: {
        task: {
            type: Task,
            required: true,
        },
    },
    setup(props) {
        const input = ref<HTMLInputElement | null>(null)
        const popup = ref<typeof Popup | null>(null)
        return {
            popup,
            focused: focusedTask,
            async deleteClick() {
                await props.task.delete()
            },
            async doneClick() {
                await props.task.$setAndSaveAttributes({
                    done: !props.task.done,
                })
            },
            async taskInput(event: InputEvent) {
                await props.task.$setAndSaveAttributes({
                    title: event.target.value,
                })
            },
            parseDate(date: Date) {
                return DateTime.fromJSDate(date)
            },
            log: console.log,
            input,
            focus() {
                popup.value?.open().then(() => input.value?.focus())
            },
        }
    },
}
</script>
