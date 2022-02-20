<template>
    <RouterView v-slot="{ Component }">
        <template v-if="Component">
            <KeepAlive>
                <Suspense>
                    <!-- main content -->
                    <component :is="Component"></component>

                    <!-- loading state -->
                    <template #fallback> Loading... </template>
                </Suspense>
            </KeepAlive>
        </template>
    </RouterView>
</template>

<script lang="ts" setup></script>
