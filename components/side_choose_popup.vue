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
        <div class="modal w-1/3 h-1/3 bg-teal-800 p-6 flex justify-between items-center rounded-lg">
            <div class="border-2 rounded-lg border-teal-600 hover:bg-teal-700">
                <img :src="`/tt.png`" alt="tt" class="w-64 h-64" @click="$emit('tt')"/>
            </div>
            <div class="border-2 border-teal-600 rounded-lg p-4 hover:bg-teal-700">
                <img :src="`/ct.png`" alt="ct" class="w-56 h-56" @click="$emit('ct')"/>
            </div>
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

.side:hover {
    background-color: ;
}
</style>