<template>
    <Dialog>
        <template #trigger="{ open }">
            <slot name="trigger" :open="open"></slot>
        </template>
        <template #title>Edit List</template>
        <template #content>
            <EditListForm :list="list"></EditListForm>
        </template>
        <template #actions="{ close }">
            <TextButton @click="close()">Discard</TextButton>
            <TextButton @click="list.save().then(() => close())">Save</TextButton>
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import { List } from '../models/List'
import Dialog from './Dialog.vue'
import EditListForm from './EditListForm.vue'
import TextButton from './TextButton.vue'

const props = defineProps<{
    list: List
}>()

const list = props.list.clone() as List
</script>
