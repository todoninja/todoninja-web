<template>
    <popup>
        <template v-slot:trigger="{ open }">
            <div
                v-bind="$attrs"
                @click="open"
                class="bg-blue-100 rounded-full h-8 w-8 flex flex-row items-center justify-center"
            >
                <i class="hero user outline text-lg text-blue-500"></i>
            </div>
        </template>
        <template v-slot:content>
            <div class="flex flex-row items-center justify-start">
                <div class="bg-blue-100 rounded-full h-10 w-10 flex flex-row items-center justify-center">
                    <i class="hero user outline text-xl text-blue-500"></i>
                </div>
                <div class="ml-4">
                    <div class="font-semibold">Account Name</div>
                    <div class="text-sm text-gray-700">Account Subtitle</div>
                </div>
            </div>
            <div class="border-t h-8 w-[calc(100%+8rem)] -mx-8 mt-8"></div>
            <div class="flex flex-row items-center">
                <i class="hero cog solid"></i>
                <div class="ml-8">Settings</div>
            </div>
            <div class="border-t h-4 w-[calc(100%+8rem)] -mx-8 mt-8"></div>
            <div class="flex flex-row items-center justify-center -mb-4 text-sm text-gray-700">
                <a href="https://github.com/todoninja/todoninja-web" target="_blank" rel="noopener noreferrer">
                    Github
                    <i class="hero external-link solid"></i>
                </a>
                <div class="mx-4">&bull;</div>
                <router-link to="/privacypolicy" class="clickable">Privacy Policy</router-link>
            </div>
        </template>
    </popup>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Popup from './Popup.vue'

export default defineComponent({
    components: { Popup },
    setup() {},
})
</script>
