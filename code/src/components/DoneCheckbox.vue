<template>
    <div @click.stop="$emit('input', true)" v-if="!value" class="w-4 h-4 border-2 border-gray-800 rounded"></div>
    <div
        @click.stop="$emit('input', false)"
        v-else
        class="w-4 h-4 border-2 border-green-600 rounded bg-green-600 flex flex-row items-center justify-center"
    >
        <i class="hero solid check text-white"></i>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        value: Boolean,
    },
    emits: ['input'],
    setup(props) {},
})
</script>
