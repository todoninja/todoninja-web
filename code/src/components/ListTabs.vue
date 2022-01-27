<template>
    <horizontal-scrolling>
        <div class="flex flex-row items-center justify-center">
            <div
                @click="$emit('input', list.id)"
                v-for="list of lists"
                :key="list.id"
                class="px-4 py-2 rounded font-semibold text-sm mr-2 flex flex-row items-center transition-colors"
                :class="{
                    'bg-blue-100 text-blue-900': list.id == value,
                    'text-gray-800 bg-white': list.id != value,
                }"
            >
                <i class="hero light-bulb solid outline mr-2"></i>
                <div class="whitespace-nowrap">{{ list.name }}</div>
            </div>
            <popup @close="resetClick" @open="popupOpens()">
                <template v-slot:trigger="{ open }">
                    <i @click="open" class="hero plus solid text-gray-400 text-xl"></i>
                </template>
                <template v-slot:content="{ close }">
                    <label for="name" class="block text-sm font-medium text-slate-700"> Name </label>
                    <input
                        id="name"
                        type="text"
                        class="input-base mt-1"
                        v-model="newList.name"
                        @keydown.enter="createClick().then(() => close())"
                        ref="nameInput"
                    />
                    <label for="name" class="block text-sm font-medium text-slate-700 mt-4">Backend</label>
                    <select v-model="newList.backend" class="mt-1 input-base">
                        <option value="InMemory">In Memory</option>
                        <option value="LocalStorage">Local Storage</option>
                    </select>
                    <div class="flex flex-row items-center justify-end mt-4">
                        <div
                            @click="createClick().then(() => close())"
                            class="rounded bg-blue-100 text-blue-900 font-bold px-4 py-2 text-sm"
                        >
                            Save
                        </div>
                    </div>
                </template>
            </popup>
        </div>
    </horizontal-scrolling>
</template>

<script lang="ts">
import { reactive, ref } from '@vue/reactivity'
import Popup from './Popup.vue'
import { asyncRef } from '../asyncRef'
import { InMemoryList, List, LocalStorageList } from '../models/List'
import HorizontalScrolling from './HorizontalScrolling.vue'
import { nextTick } from '@vue/runtime-core'
export default {
    components: { Popup, HorizontalScrolling },
    emits: ['input'],
    props: {
        value: {
            type: Number,
            default: null,
        },
    },
    setup(props: { value: number | null }, context) {
        const newList = reactive({ name: '', backend: 'LocalStorage' })
        const lists = asyncRef(async () => [List.default(), ...(await List.all())])
        const resetNewList = () => {
            newList.name = ''
        }
        const nameInput = ref<HTMLInputElement | null>(null)

        return {
            lists,
            newList,
            nameInput,
            async createClick() {
                const { backend, ...attrs } = newList
                if (backend == 'LocalStorage') {
                    await LocalStorageList.create(attrs)
                } else if (backend == 'InMemory') {
                    await InMemoryList.create(attrs)
                }
                resetNewList()
            },
            resetClick: resetNewList,
            popupOpens() {
                nextTick(() => {
                    nameInput.value?.focus()
                })
            },
        }
    },
}
</script>
