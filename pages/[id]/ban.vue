<script setup lang="ts">
const route = useRoute()
const url = useRequestURL()
const lobby_id = ref('')
lobby_id.value = route.params.id
let lobby_exists = ref(false)
let team_selected = ref("")
let maps = ref([])
let team_1 = ref("")
let team_2 = ref("")
let banned_maps = ref([])
let turn = ref("")
let type = ref("")
let map1 = ref("")
let map2 = ref("")
let map3 = ref("")
let map4 = ref("") // Added for bo5
let map5 = ref("") // Added for bo5
let choose_side = ref(false)
let side_choice_phase = ref(false)
let maps_spect = ref([])

onMounted(async () => {
    await fetch(`/api/lobby_data?id=${lobby_id.value}`)
        .then(async res => {
            const json = await res.json();
            const data = json.data
            if (res.status == 200) {
                lobby_exists.value = true
                maps.value = data.all_maps
                for (let i = 0; i < maps.value.length; i++) {
                    maps.value[i] = {
                        map: maps.value[i],
                        banned: false,
                        picked: false,
                        team: ""
                    }
                }
                team_1.value = data.t1_name
                team_2.value = data.t2_name
                type.value = data.type
                map1.value = data.map1
                map2.value = data.map2
                map3.value = data.map3
                map4.value = data.map4 // Added for bo5
                map5.value = data.map5 // Added for bo5
                side_choice_phase.value = data.side_choice_phase
                maps_spect.value = data.maps_spect
                //console.log(maps.value)
                check_bans()
                check_picks()
                check_side_modal()
                check_side()
                for (let i = 0; i < maps.value.length; i++) {
                    maps.value[i].map = maps.value[i].map.toLowerCase()
                }
            }
        })

    setInterval(async () => {
        await fetch_data()
    }, 1000)
})

function check_bans() {
    for (let i = 0; i < maps.value.length; i++) {
        if (banned_maps.value.includes(maps.value[i].map)) {
            //console.log(maps.value[i])
            maps.value[i].banned = true
        } else {
            //console.log(maps.value[i])
            maps.value[i].banned = false
        }
    }
}

function check_picks() {
    for (let i = 0; i < maps.value.length; i++) {
        if (type.value === "bo5") {
            // For bo5, we need to check 5 maps (4 picked + 1 decider)
            if (map1.value == maps.value[i].map || map2.value == maps.value[i].map || 
                map3.value == maps.value[i].map || map4.value == maps.value[i].map || 
                map5.value == maps.value[i].map) {
                maps.value[i].picked = true
            } else {
                maps.value[i].picked = false
            }
        } else {
            // Original logic for bo1 and bo3
            if (map1.value == maps.value[i].map || map2.value == maps.value[i].map || map3.value == maps.value[i].map) {
                maps.value[i].picked = true
            } else {
                maps.value[i].picked = false
            }
        }
    }
}

function check_side() {
    if (type == "bo1") {
        return;
    }
    for(let i = 0; i < maps_spect.value.length; i++) {
        for(let j = 0; j < maps.value.length; j++) {
            if(maps_spect.value[i].name == maps.value[j].map) {
                if(maps_spect.value[i].picked) {
                    if(maps_spect.value[i].is_decider) continue;
                    if(maps_spect.value[i].side_choice == "") continue;
                    if(maps_spect.value[i].side_choice == "ct") {
                        if(maps_spect.value[i].team == team_selected.value) {
                            maps.value[j].team = "tt"
                            maps.value[j] = maps.value[j]
                        } else {
                            maps.value[j].team = "ct"
                            maps.value[j] = maps.value[j]
                        }
                    } else {
                        if(maps_spect.value[i].team == team_selected.value) {
                            maps.value[j].team = "ct"
                            maps.value[j] = maps.value[j]
                        } else {
                            maps.value[j].team = "tt"
                            maps.value[j] = maps.value[j]
                        }
                    }
                }
            }
        }
    }
    //console.log(maps.value)
}

function check_side_modal() {
    if (type.value == "bo1") {
        choose_side.value = false
        return;
    }
    if(!side_choice_phase.value) {
        choose_side.value = false
        return;
    }
    if(team_selected.value != turn.value) {
        choose_side.value = false
        return;
    }
    
    // For bo5, we need different logic for when to show side choice
    if (type.value == "bo5") {
        // In bo5, side choice is needed after each map pick
        // We need to check if the current map has been picked but side hasn't been chosen yet
        for (let i = 0; i < maps_spect.value.length; i++) {
            // Only show side choice for picked maps that aren't deciders and don't have a side choice yet
            if (maps_spect.value[i].picked && !maps_spect.value[i].is_decider && maps_spect.value[i].side_choice === "") {
                choose_side.value = true
                return;
            }
        }
        choose_side.value = false
    } else {
        // Original bo3 logic
        if (banned_maps.value.length != 2 && banned_maps.value.length != 3) {
            choose_side.value = false
            return;
        }
        
        // Check if maps are set
        if (map1.value == "" && map2.value == "") {
            choose_side.value = false
            return;
        }

        // If we have maps and we're in the right phase, show the side choice
        choose_side.value = true
    }
}

async function fetch_data() {
    //console.log("fetching data")
    await fetch(`/api/lobby_data?id=${lobby_id.value}`)
        .then(async res => {
            const json = await res.json();
            const data = json.data
                //console.log(data)
            if (res.status == 200) {
                banned_maps.value = data.banned_maps
                turn.value = data.team_turn
                map1.value = data.map1
                map2.value = data.map2
                map3.value = data.map3
                map4.value = data.map4 // Added for bo5
                map5.value = data.map5 // Added for bo5
                side_choice_phase.value = data.side_choice_phase
                maps_spect.value = data.maps_spect
                check_bans()
                check_picks()
                check_side_modal()
                check_side()
            }
        })
}

function team_select(team: string) {
    //console.log(team)
    team_selected.value = team
}

function ban_map(map: string) {
    let map_name = map.map
    //console.log(banned_maps.value.length)
    if (banned_maps.value.length == 6) {
        return
    }
    if (banned_maps.value.includes(map_name)) {
        return
    }
    if (team_selected.value == turn.value) {
        banned_maps.value.push(map_name)
        //console.log(banned_maps.value)
        fetch(`/api/ban_map`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                banned_map: map_name,
                id: lobby_id.value,
                team: team_selected.value
            })
        })
    }
    fetch_data()
}

function choose_ct() {
    choose_side.value = false
    fetch(`/api/choose_side`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            side: "ct",
            id: lobby_id.value
        })
    })
    fetch_data()
}

function choose_tt() {
    choose_side.value = false
    fetch(`/api/choose_side`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            side: "tt",
            id: lobby_id.value
        })
    })
    fetch_data()
}

</script>

<template>
    <div class="justify-center items-center flex h-screen w-full bg-slate-700">
        <div v-if="lobby_exists" class="justify-center items-center flex flex-row-reverse">
            <div v-if="team_selected" class="flex flex-col justify-center items-center">
                <div v-if="choose_side">
                    <SideChoosePopup :id="lobby_id" :route="url.origin" :map="maps_spect[maps_spect.length - 1].name" @ct="choose_ct" @tt="choose_tt" />
                </div>
                <div v-else>
                    <div class="relative inset-y-40 text-7xl text-white text">
                        <div class="flex justify-center items-center">
                            {{ team_selected }}
                        </div>
                        <div v-if="turn == team_selected" class="flex justify-center items-center">
                            Twoja kolej
                        </div>
                        <div v-else class="flex justify-center items-center">
                            Kolej przeciwnika
                        </div>
                    </div>
                    <div class="flex">
                        <li v-for="map in maps" :key="map" class="list-none">
                            <Map :map="map.map" :banned="map.banned" :picked="map.picked" :team="map.team" @click="ban_map(map)" />
                        </li>
                    </div>
                </div>
            </div>
            <div v-else class="flex items-center justify-center flex-col">
                <div>
                    <h1 class="text-white -mt-80 text-6xl text">Wybierz druzyne</h1>
                </div>
                <TeamSelect :team1="team_1" :team2="team_2" @team_selected="team_select" />
            </div>
        </div>
        <div v-else class="w-1/3 h-1/3 bg-slate-800 flex items-center justify-center text-white text-7xl rounded-lg">
            Lobby nie istnieje
        </div>
    </div>
</template>
