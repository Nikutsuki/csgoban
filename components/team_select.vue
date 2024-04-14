<script setup lang="ts">

const props = defineProps<{
    team1: string
    team2: string
}>()

</script>

<template>
    <div class="">
        <button @click="$emit('team_selected', props.team1)" class="bg-slate-800 text-white text-7xl rounded-lg p-2 m-2">
            {{ props.team1 }}
        </button>
        <button @click="$emit('team_selected', props.team2)" class="bg-slate-800 text-white text-7xl rounded-lg p-2 m-2">
            {{ props.team2 }}
        </button>
    </div>
</template>