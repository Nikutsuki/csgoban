<script setup lang="ts">

const props = defineProps<{
    map: string
    banned: boolean
    picked: boolean
    team: string
}>()

console.log(props.map, props.banned, props.picked)

</script>

<template>
    <div v-if="picked" class="w-full h-screen flex justify-center items-center bg-slate-700 p-2 flex-col">
        <div class="img_border">
            <img :src="`/maps/${props.map}.png`" alt="map" class="w-full h-full img" />
            <div v-if="team != ''" class="absolute">
                <img :src="`/${props.team}.png`" :alt="`${props.team}`" class="w-32 h-32" />
            </div>
        </div>
        <div class="text-green-300 text-4xl text">
            {{ props.map }}
        </div>
    </div>
    <div v-else-if="!banned" class="w-full h-screen flex justify-center items-center bg-slate-700 p-2 flex-col">
        <div class="img_border">
            <img :src="`/maps/${props.map}.png`" alt="map" class="w-full h-full img" />
        </div>
        <div class="text-white text-4xl text">
            {{ props.map }}
        </div>
    </div>
    <div v-else class="w-full h-screen flex justify-center items-center bg-slate-700 p-2 flex-col">
        <div class="img_border">
            <img :src="`/maps/${props.map}.png`" alt="map" class="w-full h-full img" />
        </div>
        <div class="text-red-700 text-4xl text">
            {{ props.map }}
        </div>
    </div>
</template>

<style>

    .img {
        width: 200px;
        height: 200px;
    }

    .img_border {
        --tw-bg-opacity: 1;
        background-color: rgb(30 41 59 / var(--tw-bg-opacity));
        display: flex;
        justify-content: center;
        align-items: center;
        --tw-text-opacity: 1;
        color: rgb(255 255 255 / var(--tw-text-opacity));
        font-size: 4.5rem/* 72px */;
        line-height: 1;
        border-radius: 0.5rem;
        padding: 0.5rem;
        transition: background-color 0.3s ease;
    }

    .img_border:hover {
        --tw-bg-opacity: 1;
        background-color: yellow
    }

    .text {
        font-family: "Counter-Strike";
        text-shadow: 2px 2px 2px black;
    }
</style>