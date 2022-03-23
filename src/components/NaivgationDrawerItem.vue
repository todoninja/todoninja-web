<template>
    <div
        :class="`rounded-full ${
            active ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant'
        } font-medium text-sm py-4 grid grid-cols-[auto_1fr] gap-3 pl-4 pr-6 items-center`"
    >
        <i :class="`hero ${icon} ${active ? 'solid' : 'outline'} text-2xl`"></i>
        {{ title }}
    </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; icon: string; active?: boolean }>()
</script>
