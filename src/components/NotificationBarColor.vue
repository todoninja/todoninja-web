<template>
    <teleport to="head">
        <meta name="theme-color" :content="color" />
    </teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { overlaying } from '../use/overlaying'

const props = defineProps<{ color: string }>()

function getCSSVar(name: string) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

type RGB = [number, number, number]

function mixColors(onehex: string, twohex: string, opacity: number) {
    function torgb(hex: string) {
        const [_, one, two, three, four, five, six] = hex.split('')
        return [`${one}${two}`, `${three}${four}`, `${five}${six}`].map((hex) => parseInt(hex, 16)) as RGB
    }

    function tohex(rgb: RGB) {
        return `#${rgb.map((value) => value.toString(16).split('.')[0].padStart(2, '0')).join('')}`
    }

    const one = torgb(onehex)
    const two = torgb(twohex)
    const both = [
        [one[0], two[0]],
        [one[1], two[1]],
        [one[2], two[2]],
    ] as [[number, number], [number, number], [number, number]]

    return tohex(both.map(([one, two]) => one * (1 - opacity) + two * opacity) as RGB)
}

const color = computed(() => mixColors(getCSSVar(`--${props.color}`), '#000000', overlaying.value))
</script>
