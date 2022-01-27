<template>
    <horizontal-scrolling>
        <div class="flex flex-row items-center justify-center">
            <popup v-for="list of lists" :key="list.id">
                <template v-slot:trigger="{ open }">
                    <div
                        v-longpressable
                        @longpress="list.id != null && open()"
                        @click="$emit('input', list.id)"
                        class="px-4 py-2 rounded font-semibold text-sm mr-2 flex flex-row items-center transition-colors"
                        :class="{
                            'bg-blue-100 text-blue-900': list.id == value,
                            'text-gray-800 bg-white': list.id != value,
                        }"
                    >
                        <div>{{ list.icon() }}</div>
                        <div class="whitespace-nowrap ml-2">{{ list.nameWithoutIcon() }}</div>
                    </div>
                </template>
                <template v-slot:content="{ close }">
                    <label for="name" class="block text-sm font-medium text-slate-700"> Name </label>
                    <input
                        id="name"
                        type="text"
                        class="input-base mt-1"
                        v-model="list.name"
                        @keydown.enter="list.save().then(() => close())"
                    />
                    <div class="flex flex-row items-center justify-between mt-4">
                        <popup>
                            <template v-slot:trigger="{ open }">
                                <i
                                    @click="open"
                                    class="hero trash outline text-red-500 py-2 px-4 bg-gray-100 rounded"
                                ></i>
                            </template>
                            <template v-slot:content="{ close: closeConfirmation }">
                                Do you really want to delete List
                                <b>{{ list.name }}</b> ?
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
                                                .then(() => close())
                                                .then(() => list.delete())
                                        "
                                        class="rounded bg-red-100 text-red-900 font-bold px-4 py-2 text-sm"
                                    >
                                        <i class="hero trash outline"></i>
                                        Delete
                                    </div>
                                </div>
                            </template>
                        </popup>
                        <div
                            @click="list.save().then(() => close())"
                            class="rounded bg-blue-100 text-blue-900 font-bold px-4 py-2 text-sm"
                        >
                            Save
                        </div>
                    </div>
                </template>
            </popup>
            <popup @close="resetClick" @open="popupOpens()">
                <template v-slot:trigger="{ open }">
                    <i @click="open" class="hero plus solid text-gray-400 text-xl"></i>
                </template>
                <template v-slot:content="{ close }">
                    <div class="grid grid-cols-[auto_1fr] gap-4">
                        <div>
                            <label for="name" class="block text-sm font-medium text-slate-700"> Name </label>
                            <input
                                id="name"
                                type="text"
                                class="input-base mt-1"
                                v-model="newList.name"
                                @keydown.enter="createClick().then(() => close())"
                                ref="nameInput"
                            />
                        </div>
                    </div>
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
        const newList = reactive({ name: '', icon: undefined, backend: 'LocalStorage' })
        const lists = asyncRef(async () => [List.default(), ...(await List.all())])
        const resetNewList = () => {
            newList.name = ''
            newList.icon = undefined
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
            log(...args) {
                console.log(...args)
            },
        }
    },
}
</script>
