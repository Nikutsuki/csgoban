<script setup lang="ts">

const props = defineProps<{
    map: string
    banned: boolean
    picked: boolean
    team: string
    team_number: number
    is_decider: boolean
    side_choice: string
    side_choice_team: string
}>()

</script>

<template>
    <div v-if="props.is_decider" class="p-2 container slide-up">
        <div class=" flex items-center justify-center text-white text-7xl rounded-lg p-2">
            <div class="team-bar text-xl bg-white text-black">
                <span class=" bg-amber-500 w-80 max-w-80 h-10 justify-center items-center flex">DECIDER</span>
            </div>
            <img :src="`/maps/${props.map}.png`" alt="map" class="w-full h-full img picked" />
            <div class="text-white text-5xl centered picked-text">
                {{ props.map }}
            </div>
        </div>
    </div>
    <div v-else-if="props.picked" class="p-2 container slide-up">
        <div class=" flex items-center justify-center text-white text-7xl rounded-lg p-2">
            <div v-if="props.team_number == 0" class="team-bar text-xl bg-white text-black">
                <span class="team-name bg-blue-500">{{ props.team }}</span>
                <span class="px-6">PICK</span>
            </div>
            <div v-else class="team-bar text-xl bg-white text-black">
                <span class="team-name bg-red-500">{{ props.team }}</span>
                <span class="px-6">PICK</span>
            </div>
            <img :src="`/maps/${props.map}.png`" alt="map" class="w-full h-full img picked" />
            <div class="text-white text-5xl centered picked-text">
                {{ props.map }}
            </div>
            <div v-if="side_choice != ''" class="">
                <div class="bottom-bar text-xl bg-white text-black">
                    <div class="flex h-10 w-24 justify-center bg-white">
                        <img :src="`/${side_choice}.png`" alt="side" class="bg-white" />
                    </div>
                    <span v-if="props.team_number == 0" class="justify-end team-name bg-red-500">{{ side_choice_team }}</span>
                    <span v-else class="justify-end team-name bg-blue-500">{{ side_choice_team }}</span>
                </div>
            </div>
        </div>
    </div>
    <div v-else-if="!props.banned" class="p-2 container slide-up">
        <div class=" flex items-center justify-center text-white text-7xl rounded-lg p-2 neutral">
            <img :src="`/maps/${props.map}.png`" alt="map" class="w-full h-full img" />
            <div class="text-white text-xl centered">
                {{ props.map }}
            </div>
        </div>
    </div>
    <div v-else class="p-2 container slide-up">
        <div class="flex items-center justify-center text-white text-7xl rounded-lg p-2">
            <div v-if="props.team_number == 0" class="team-bar text-xl bg-white text-black">
                <span class="team-name bg-blue-500">{{ props.team }}</span>
                <span class="px-6">BAN</span>
            </div>
            <div v-else class="team-bar text-xl bg-white text-black">
                <span class="team-name bg-red-500">{{ props.team }}</span>
                <span class="px-6">BAN</span>
            </div>
            <img :src="`/maps/${props.map}.png`" alt="map" class="w-full h-full img banned" />
            <div class="text-gray-300 font-sans text-5xl centered">
                {{ props.map }}
            </div>
        </div>
    </div>
</template>

<style>
.picked-text {
    text-shadow: 2px 2px 2px black;
}

.container {
    width: 265px;
    height: 265px;
    position: relative;
    text-align: center;
    justify-content: center;
    color: white;
}

.centered {
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: "Counter-Strike";
}

.banned {
    filter: grayscale(100%) brightness(40%);
}

.team-bar {
    position: absolute;
    top: 16px;
    left: 16px;
    width: 233px;
    display: flex;
    z-index: 1;
    align-items: center;
    justify-content: space-between;
}

.team-name {
    height: 40px;
    max-width: 141px;
    display: flex;
    width: 141px;
    overflow: hidden;
    align-items: center;
    padding: 10px;
}

.bottom-bar {
    position: absolute;
    bottom: 16px;
    left: 16px;
    width: 233px;
    display: flex;
    z-index: 1;
    align-items: center;
    justify-content: space-between;
}

.slide-up {

    animation: slide-up 3s ease-out forwards;
}

@keyframes slide-up {
    0% {
        transform: translateY(500%);
    }

    100% {
        transform: translateY(0);
    }
}

.picked {
    filter: brightness(100%);
}
</style>