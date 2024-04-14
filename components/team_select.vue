<script setup lang="ts">

const props = defineProps<{
    team1: string
    team2: string
}>()

</script>

<template>
    <div class="flex justify-center items-center">
        <div class="flex justify-center m-4 items-center flex-col">
            <h1 class="text-white text-4xl text">Druzyna 1</h1>
            <button @click="$emit('team_selected', props.team1)"
                class="bg-slate-800 text-white text-7xl rounded-lg p-2 m-2">
                {{ props.team1 }}
            </button>
        </div>
        <div class="flex justify-center m-4 items-center flex-col">
            <h1 class="text-white text-4xl text font">Druzyna 2</h1>
            <button @click="$emit('team_selected', props.team2)"
                class="bg-slate-800 text-white text-7xl rounded-lg p-2 m-2">
                {{ props.team2 }}
            </button>
        </div>
    </div>
</template>