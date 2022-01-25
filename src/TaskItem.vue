<template>
    <div class="grid grid-cols-[auto_1fr_auto] gap-4 items-center mb-4">
        <div @click="doneClick()">
            <div
                v-if="!task.done"
                class="w-4 h-4 border-2 border-gray-800 rounded"
            ></div>
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
        <i
            v-show="focused == task.id"
            @click="deleteClick()"
            class="hero solid x text-gray-500"
        ></i>
    </div>
</template>

<script lang="ts">
import { focusedTask } from './globals'
import { Task } from './models/Task'
export default {
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
            timeout: (callback, time) => setTimeout(callback, time),
        }
    },
}
</script>
