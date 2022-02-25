<template>
    <RouterView v-slot="{ Component }">
        <template v-if="Component">
            <Transition :name="pageTransition">
                <KeepAlive>
                    <Suspense>
                        <!-- main content -->
                        <component :is="Component"></component>

                        <!-- loading state -->
                        <template #fallback> Loading... </template>
                    </Suspense>
                </KeepAlive>
            </Transition>
        </template>
    </RouterView>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { navigationInfo } from './router'

const pageTransition = computed(
    () =>
        ({
            forward: 'page-forward',
            backward: 'page-backward',
            none: 'fade-through',
        }[navigationInfo.direction])
)
</script>
