<template>
    <div @click.stop="$emit('input', true)" v-if="!value" :class="`w-4 h-4 border-2 ${borderClass} rounded`"></div>
    <div
        @click.stop="$emit('input', false)"
        v-else
        class="w-4 h-4 border-2 border-green-600 rounded bg-green-600 flex flex-row items-center justify-center"
    >
        <i class="hero solid check text-white text-base"></i>
    </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ value: Boolean; borderClass?: string }>(), { borderClass: 'border-on-surface' })
defineEmits(['input'])
</script>
