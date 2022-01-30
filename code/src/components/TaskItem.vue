<template>
    <div>
        <popup ref="popup" :id="`task-detail-${task.id}`">
            <template v-slot:trigger="{ open }">
                <div v-bind="$attrs" @click="open" class="grid grid-cols-[auto_1fr_auto] gap-4 items-center mb-4">
                    <done-checkbox :value="task.done" @input="task.update({ done: $event })" />
                    <div>
                        {{ task.title }}
                    </div>
                </div>
            </template>
            <template v-slot:content="{ close }">
                <div class="grid grid-cols-[auto_1fr] gap-4 items-center mb-4">
                    <done-checkbox :value="task.done" @input="task.update({ done: $event })" />
                    <input
                        type="text"
                        :value="task.title"
                        @focus="focused = task.id"
                        @input="taskInput($event)"
                        @keyup.enter="close()"
                        ref="input"
                    />
                </div>
                <div class="flex flex-row items-center mt-4">
                    <popup :id="`task-detail-${task.id}-postpone-picker`">
                        <template v-slot:trigger="{ open }">
                            <div @click="open" class="rounded-full border px-3 py-1 text-sm flex flex-row items-center">
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
                popup.value.open().then(() => input.value.focus())
            },
        }
    },
}
</script>
