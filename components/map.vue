<script setup lang="ts">

const props = defineProps<{
    map: string
    banned: boolean
    picked: boolean
}>()

console.log(props.map, props.banned, props.picked)

</script>

<template>
    <div v-if="picked" class="w-full h-screen flex justify-center items-center bg-slate-700 p-2 flex-col">
        <div class=" bg-slate-800 flex items-center justify-center text-white text-7xl rounded-lg p-2">
            <img :src="`/maps/${props.map}.png`" alt="map" class="w-full h-full img" />
        </div>
        <div class="text-green-300 text-xl">
            {{ props.map }}
        </div>
    </div>
    <div v-else-if="!banned" class="w-full h-screen flex justify-center items-center bg-slate-700 p-2 flex-col">
        <div class=" bg-slate-800 flex items-center justify-center text-white text-7xl rounded-lg p-2">
            <img :src="`/maps/${props.map}.png`" alt="map" class="w-full h-full img" />
        </div>
        <div class="text-white text-xl">
            {{ props.map }}
        </div>
    </div>
    <div v-else class="w-full h-screen flex justify-center items-center bg-slate-700 p-2 flex-col">
        <div class=" bg-slate-800 flex items-center justify-center text-white text-7xl rounded-lg p-2">
            <img :src="`/maps/${props.map}.png`" alt="map" class="w-full h-full img" />
        </div>
        <div class="text-red-700 text-xl">
            {{ props.map }}
        </div>
    </div>
</template>

<style>

    .img {
        width: 200px;
        height: 200px;
    }

</style>