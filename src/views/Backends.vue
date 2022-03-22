<template>
    <div class="">
        <div class="flex flex-row items-center px-4 pt-4">
            <i @click="$router.back()" class="hero chevron-left solid p-4 -m-4"></i>
            <h1 class="ml-2">Backends</h1>
        </div>
        <div class="p-4 mt-8">
            <div class="flex flex-row items-center justify-between">
                <div class="font-semibold uppercase text-sm">Local</div>
                <div class="flex flex-row items-center justify-start">
                    <div class="bg-green-500 h-2 w-2 rounded-full"></div>
                    <div class="text-xs text-green-500 uppercase font-bold tracking-wide ml-2">Connected</div>
                </div>
            </div>
            <div class="text-gray-500 mt-4 italic">This Backend cannot be removed.</div>
        </div>
        <div class="p-4 mt-8">
            <div class="flex flex-row items-center justify-between">
                <div class="font-semibold uppercase text-sm">Todoninja Cloud</div>
                <div class="flex flex-row items-center justify-start">
                    <div class="text-xs text-blue-500 uppercase font-bold tracking-wide mr-1">Connect</div>
                    <i class="hero chevron-right solid text-blue-500"></i>
                </div>
            </div>
        </div>
    </div>
</template>
