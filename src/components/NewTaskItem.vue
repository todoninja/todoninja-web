<template>
    <div class="grid grid-cols-[auto_1fr_auto] gap-4 items-center mb-4">
        <i
            class="hero solid plus"
            :class="{
                'text-gray-500': focused != 'new',
                'text-black': focused == 'new',
            }"
        ></i>
        <input
            type="text"
            placeholder="New Task..."
            v-model="newTask.title"
            @focus="focused = 'new'"
            @keyup.enter="createClick()"
        />
        <i
            v-show="focused == 'new' && newTask.title.length > 0"
            @click="resetClick()"
            class="hero solid x text-gray-500"
        >
        </i>
    </div>
</template>

<script lang="ts">
import { reactive } from 'vue'
import { List } from '../models/List'
import { focusedTask } from '../globals'
export default {
    props: {
        list: {
            type: List,
            required: true,
        },
    },
    setup(props: { list: List }) {
        const newTask = reactive({ title: '' })
        const resetTask = () => {
            newTask.title = ''
        }

        return {
            newTask,
            focused: focusedTask,
            async createClick() {
                await props.list.tasks().create(newTask)
                resetTask()
            },
            resetClick: resetTask,
        }
    },
}
</script>
