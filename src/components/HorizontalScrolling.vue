<template>
    <div class="overflow-y-auto flex flex-row hidebar">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.hidebar::-webkit-scrollbar {
    height: 0 !important;
}

.hidebar {
    -ms-overflow-style: none;
}
</style>
