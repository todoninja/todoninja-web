<template>
    <div @click="$emit('click', $event)" class="px-3 py-3 flex flex-row items-center clickable-bg">
        <i v-if="icon" :class="`hero ${icon} outline text-on-surface-variant text-2xl mr-3`"></i>
        <div class="text-on-surface-variant">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{ icon?: string }>()
</script>
