<template>
    <teleport to="head">
        <meta name="theme-color" :content="color" />
    </teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ color: string }>()

function getCSSVar(name: string) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

const color = computed(() => getCSSVar(`--${props.color}`))
</script>
