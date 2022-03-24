<template>
    <div
        class="rounded-lg border border-outline pl-2 pr-4 py-[0.313rem] text-sm flex flex-row items-center whitespace-nowrap clickable"
    >
        <i
            v-if="icon"
            :class="{
                'text-primary': type == 'assist',
                'text-on-surface-variant': type == 'input',
                [`hero solid mr-2 ${icon} text-lg`]: true,
            }"
        ></i>
        <div v-else class="w-2"></div>
        <div
            :class="{
                'text-on-surface': type == 'assist',
                'text-on-surface-variant': type == 'input',
            }"
            class="font-medium"
        >
            <slot></slot>
        </div>
        <i
            v-if="removable"
            @click.stop="emit('remove')"
            class="hero x solid -mr-2 ml-2 text-lg text-on-surface-variant"
        ></i>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ icon: string; removable?: boolean; type: 'assist' | 'input' }>()
const emit = defineEmits(['remove'])
</script>
