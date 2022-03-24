<template>
    <navigation-drawer-item
        v-for="list of lists"
        :key="list.id || 'default'"
        :title="list.nameWithoutIcon()"
        icon="collection"
        :active="list.id == value"
        @click="$emit('input', list.id)"
    ></navigation-drawer-item>
    <Dialog @open="popupOpens()">
        <template #title> Create a new list </template>
        <template #trigger="{ open }">
            <navigation-drawer-item @click="open" title="Create List" icon="plus" />
        </template>
        <template #content="{ close }">
            <input
                id="name"
                type="text"
                class="input-base mt-1"
                v-model="newList.name"
                @keydown.enter="createClick().then(() => close())"
                ref="nameInput"
            />
            <label for="backend" class="block text-sm font-medium text-slate-700 mt-4">Backend</label>
            <select v-model="newList.backend" class="mt-1 input-base" id="backend">
                <option value="InMemory">In Memory</option>
                <option value="LocalStorage">Local Storage</option>
            </select>
        </template>
        <template #actions="{ close }">
            <text-button @click="close()">Discard</text-button>
            <text-button @click="createClick().then(() => close())">Save</text-button>
        </template>
    </Dialog>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue'
import { asyncRef } from '../asyncRef'
import { InMemoryList, List, LocalStorageList } from '../models/List'
import NavigationDrawerItem from './NavigationDrawerItem.vue'
import Dialog from './Dialog.vue'
import TextButton from './TextButton.vue'

defineEmits<{
    (e: 'input', listId?: number | null): void
}>()

defineProps<{
    value?: number | null
}>()

const lists = await asyncRef(async () => [List.default(), ...(await List.all())])

const newList = reactive({ name: '', backend: 'LocalStorage' })
const resetNewList = () => {
    newList.name = ''
}

const nameInput = ref<HTMLInputElement | null>(null)

async function createClick() {
    const { backend, ...attrs } = newList
    if (backend == 'LocalStorage') {
        await LocalStorageList.create(attrs)
    } else if (backend == 'InMemory') {
        await InMemoryList.create(attrs)
    }
    resetNewList()
}

function popupOpens() {
    resetNewList()
    nextTick(() => {
        nameInput.value?.focus()
    })
}
</script>
