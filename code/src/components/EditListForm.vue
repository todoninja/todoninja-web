<template>
    <div v-if="list">
        <label for="name" class="block text-sm font-medium text-slate-700"> Name </label>
        <input id="name" type="text" class="input-base mt-1" v-model="list.name" @keydown.enter="saveClick()" />
        <div class="flex flex-row items-center justify-between mt-4">
            <popup :id="`delete-list-${list.id}`">
                <template v-slot:trigger="{ open }">
                    <i @click="open" class="hero trash outline text-red-500 py-2 px-4 bg-gray-100 rounded"></i>
                </template>
                <template v-slot:content="{ close: close }">
                    Do you really want to delete List
                    <b>{{ list.name }}</b> ?
                    <div class="flex flex-row items-center justify-between mt-4">
                        <div @click="close()" class="rounded bg-gray-100 text-gray-900 font-bold px-4 py-2 text-sm">
                            Cancel
                        </div>
                        <div
                            @click="close().then(() => deleteClick())"
                            class="rounded bg-red-100 text-red-900 font-bold px-4 py-2 text-sm"
                        >
                            <i class="hero trash outline"></i>
                            Delete
                        </div>
                    </div>
                </template>
            </popup>
            <div @click="saveClick()" class="rounded bg-blue-100 text-blue-900 font-bold px-4 py-2 text-sm">Save</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { asyncRef } from '../asyncRef'
import { List } from '../models/List'
import Popup from './Popup.vue'

export default defineComponent({
    components: { Popup },
    props: {
        listId: Number,
    },
    emits: ['save', 'delete'],
    setup(props, context) {
        const list = asyncRef(() => List.find(props.listId))

        return {
            list,
            async saveClick() {
                await list.value.save()
                context.emit('save')
            },
            async deleteClick() {
                context.emit('delete')
                list.value.delete()
            },
        }
    },
})
</script>
