<template>
    <div
        :class="{
            'h-10 w-10 rounded-xl text-2xl': size == 'small',
            'h-16 w-16 rounded-2xl text-2xl': size == undefined,
            'h-24 w-24 rounded-[28px] text-4xl': size == 'large',
        }"
        class="fixed bottom-4 right-4 bg-primary-container flex flex-row items-center justify-center shadow-md"
    >
        <i :class="`hero ${icon} outline text-on-primary-container`"></i>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    icon: string
    size?: 'small' | 'large'
}>()
</script>
