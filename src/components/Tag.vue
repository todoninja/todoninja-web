<template>
    <div class="rounded-full border px-3 py-1 text-sm flex flex-row items-center clickable-bg whitespace-nowrap">
        <i v-if="icon" :class="`hero text-blue-500 outline mr-2 ${icon}`"></i>
        <slot></slot>
        <i v-if="removable" @click.stop="emit('remove')" class="hero x solid p-2 -my-2 ml-0 -mr-3"></i>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({ icon: { type: String }, removable: { type: Boolean, default: false } })
const emit = defineEmits(['remove'])
</script>
