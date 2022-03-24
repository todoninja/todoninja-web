<template>
    <div class="grid grid-cols-[auto_1fr_auto] gap-4 items-center p-4 bg-surface text-on-surface h-16">
        <i @click="$router.back()" class="hero outline arrow-left clickable-bg -m-4 p-4 text-lg text-on-surface"></i>
        <div></div>
        <slot name="right"></slot>
    </div>
</template>
