<template>
    <div>
        <popup>
            <template v-slot:trigger="{ open }">
                <div
                    v-bind="$attrs"
                    v-longpressable
                    @longpress="open"
                    class="grid grid-cols-[auto_1fr_auto] gap-4 items-center mb-4"
                >
                    <div @click="doneClick()">
                        <div v-if="!task.done" class="w-4 h-4 border-2 border-gray-800 rounded"></div>
                        <div
                            v-else
                            class="w-4 h-4 border-2 border-green-600 rounded bg-green-600 flex flex-row items-center justify-center"
                        >
                            <i class="hero solid check text-white"></i>
                        </div>
                    </div>
                    <input
                        type="text"
                        :value="task.title"
                        @focus="focused = task.id"
                        @input="taskInput($event)"
                        class="peer"
                    />
                    <i v-show="focused == task.id" @click="deleteClick()" class="hero solid x text-gray-500"></i>
                </div>
            </template>
            <template v-slot:content>
                <div class="grid grid-cols-[auto_1fr] gap-4 items-center mb-4">
                    <div @click="doneClick()">
                        <div v-if="!task.done" class="w-4 h-4 border-2 border-gray-800 rounded"></div>
                        <div
                            v-else
                            class="w-4 h-4 border-2 border-green-600 rounded bg-green-600 flex flex-row items-center justify-center"
                        >
                            <i class="hero solid check text-white"></i>
                        </div>
                    </div>
                    <input type="text" :value="task.title" @focus="focused = task.id" @input="taskInput($event)" />
                </div>
                <div class="flex flex-row items-center mt-4">
                    <popup>
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
export default {
    components: { Popup },
    props: {
        task: {
            type: Task,
            required: true,
        },
    },
    setup(props) {
        return {
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
        }
    },
}
</script>
