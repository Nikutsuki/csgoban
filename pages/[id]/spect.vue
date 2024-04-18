<script setup lang="ts">
const route = useRoute()
const lobby_id = ref('')
lobby_id.value = route.params.id

let maps = ref([])
let maps_new = ref([])
let team_1 = ref("")
let team_2 = ref("")

onMounted(async () => {
    await fetch(`/api/lobby_data?id=${lobby_id.value}`)
        .then(async res => {
            const json = await res.json();
            const data = json.data
            if (res.status == 200) {
                maps_new.value = data.maps_spect
                team_1.value = data.t1_name
                team_2.value = data.t2_name
            }
            else {
                maps.value = []
            }
        })

    setInterval(async () => {
        await fetch_data()
    }, 1000)
})

async function fetch_data() {
    await fetch(`/api/lobby_data?id=${lobby_id.value}`)
        .then(async res => {
            const json = await res.json();
            const data = json.data
            if (res.status == 200) {
                maps_new.value = data.maps_spect
                team_1.value = data.t1_name
                team_2.value = data.t2_name
                update_maps()
            } else {
                maps.value = []
            }
        })
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

async function update_maps() {
    for(let i = 0; i < maps_new.value.length; i++) {
        let found = false
        for(let j = 0; j < maps.value.length; j++) {
            if(maps_new.value[i].name == maps.value[j].name) {
                if(maps_new.value[i].side_choice != maps.value[j].side_choice) {
                    maps.value[j].side_choice = maps_new.value[i].side_choice
                    maps.value[j].side_choice_team = maps_new.value[i].side_choice_team
                }
                found = true
            }
        }
        if(!found) {
            maps.value.push(maps_new.value[i])
            await sleep(1000)
            return
        }
    }
}

</script>

<template>
    <div class="flex w-full h-screen justify-center items-center background overflow-hidden">
        <div class="grid-container items-center">
            <map_spect v-for="map in maps" :map="map.name" :banned="map.banned" :picked="map.picked" :team="map.team"
                :team_number="map.team_number" :is_decider="map.is_decider" :side_choice="map.side_choice" :side_choice_team="map.side_choice_team"
                :lobby_id="`${lobby_id}`"/>
        </div>
    </div>
</template>

<style>
.background {
    background-color: #00b14100;
}

.grid-container {
    display: grid;
    margin-top: 690px;
    grid-template-columns: repeat(7, 1fr);
    gap: 10px;
    width: 100%;
    height: 100%;
}
</style>