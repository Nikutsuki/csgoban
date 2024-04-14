<script setup lang="ts">

const props = defineProps<{
    id: string
    route: string
}>()

const spect_link = ref('')
const team_link = ref('')

onMounted(() => {
    spect_link.value = `${props.route}/${props.id}/spect`
    team_link.value = `${props.route}/${props.id}/ban`
})

</script>

<template>
    <div class="modal-overlay">
        <div class="modal w-1/4 h-1/3 bg-teal-800 p-6 flex flex-col justify-center items-center rounded-lg">
            <span class="text-white">Spectator link:</span>
            <input type="text" v-model="spect_link" class="w-full h-10 bg-gray-200 rounded-lg input my-4" disabled>
            <span class="text-white">Team link:</span>
            <input type="text" v-model="team_link" class="w-full h-10 bg-gray-200 rounded-lg input my-4" disabled>
            <button @click="$emit('close')" class="w-full h-10 bg-blue-500 rounded-lg text-white">Close</button>
        </div>
    </div>
</template>

<style>
.modal-overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000000da;
    backdrop-filter: blur(10px);
}
</style>