<script setup lang="ts">

const props = defineProps<{
    map: string
    picks: number
    bans: number
}>()

</script>

<template>
    <div class="w-full flex justify-center items-center bg-slate-600 p-2 flex-col">
        <div class="img_border">
            <img :src="`/maps/${props.map}.png`" alt="map" class="w-full h-full img" />
        </div>
        <div class="text-white text-4xl text">
            {{ props.map }}
        </div>
        <div class="text-green-500 text-4xl text">
            Picks: {{ props.picks }}
        </div>
        <div class="text-red-500 text-4xl text">
            Bans: {{ props.bans }}
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

</style>