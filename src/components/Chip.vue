<template>
    <div
        class="rounded-md border border-outline bg-surface pl-2 pr-4 py-1 text-sm flex flex-row items-center whitespace-nowrap clickable"
    >
        <i v-if="icon" :class="`hero text-primary solid mr-2 ${icon} text-lg`"></i>
        <div v-else class="w-2"></div>
        <div class="font-medium text-on-surface">
            <slot></slot>
        </div>
        <i v-if="removable" @click.stop="emit('remove')" class="hero x solid p-2 -my-2 ml-0 -mr-3"></i>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({ icon: { type: String }, removable: { type: Boolean, default: false } })
const emit = defineEmits(['remove'])
</script>
