<script setup lang="ts">

const props = defineProps<{
    team_name: string
}>()

</script>

<template>
    <div class="p-2 m-4 w-32 bg-slate-700 h-12 rounded-lg flex justify-center items-center text text-white text-3xl">
        {{ team_name }}
    </div>
</template>

<style>
.text {
    font-family: "Counter-Strike";
    text-shadow: 2px 2px 2px black;
}
</style>