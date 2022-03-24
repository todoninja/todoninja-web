<template>
    <input placeholder="Name" type="text" class="input-base" v-model="list.name" />
</template>

<script lang="ts" setup>
import { List } from '../models/List'

defineProps<{
    list: List
}>()
</script>
