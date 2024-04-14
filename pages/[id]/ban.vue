<script setup lang="ts">
    const route = useRoute()
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

    onMounted(async () => {
        await fetch(`/api/lobby_data?id=${lobby_id.value}`)
        .then(async res => {
            const json = await res.json();
            const data = json.data
            if (res.status == 200) {
                lobby_exists.value = true
                maps.value = data.all_maps
                for(let i = 0; i < maps.value.length; i++) {
                    maps.value[i] = {
                        map: maps.value[i],
                        banned: false,
                        picked: false
                    }
                }
                //console.log(maps.value)
                check_bans()
                check_picks()
                for(let i = 0; i < maps.value.length; i++) {
                    maps.value[i].map = maps.value[i].map.toLowerCase()
                }
                team_1.value = data.t1_name
                team_2.value = data.t2_name
                type.value = data.type
                map1.value = data.map1
                map2.value = data.map2
                map3.value = data.map3
            }
        })

        setInterval(async () => {
            await fetch_data()
        }, 1000)
    })

    function check_bans() {
        for(let i = 0; i < maps.value.length; i++) {
            if(banned_maps.value.includes(maps.value[i].map)) {
                //console.log(maps.value[i])
                maps.value[i].banned = true
            } else {
                //console.log(maps.value[i])
                maps.value[i].banned = false
            }
        }
    }

    function check_picks() {
        for(let i = 0; i < maps.value.length; i++) {
            if(map1.value == maps.value[i].map || map2.value == maps.value[i].map || map3.value == maps.value[i].map) {
                maps.value[i].picked = true
            } else {
                maps.value[i].picked = false
            }
        }
    }

    async function fetch_data() {
        await fetch(`/api/lobby_data?id=${lobby_id.value}`)
            .then(async res => {
                const json = await res.json();
                const data = json.data
                if (res.status == 200) {
                    banned_maps.value = data.banned_maps
                    turn.value = data.team_turn
                    map1.value = data.map1
                    map2.value = data.map2
                    map3.value = data.map3
                    check_bans()
                    check_picks()
                    console.log(maps.value, banned_maps.value)
                }
        })
    }

    function team_select(team: string) {
        console.log(team)
        team_selected.value = team
    }

    function ban_map(map: string) {
        let map_name = map.map
        console.log(banned_maps.value.length)
        if(banned_maps.value.length == 6) {
            return
        }
        if(banned_maps.value.includes(map_name)) {
            return
        }
        if(team_selected.value == turn.value) {
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

</script>

<template>
    <div class="justify-center items-center flex h-screen w-full bg-slate-700">
        <div v-if="lobby_exists" class="justify-center items-center flex">
            <div v-if="team_selected" class="flex flex-col justify-center items-center">
                <div class="relative inset-y-7">
                    <div v-if="turn == team_selected">
                        Your turn
                    </div>
                    <div v-else>
                        Opponent's turn
                    </div>
                </div>
                <div class="flex">
                    <li v-for="map in maps" :key="map" class="list-none">
                        <Map :map="map.map" :banned="map.banned" :picked="map.picked" @click="ban_map(map)" />
                    </li>
                </div>
            </div>
            <div v-else class="flex items-center justify-center">
                <TeamSelect :team1="team_1" :team2="team_2" @team_selected="team_select" />
            </div>
        </div>
        <div v-else class="w-1/3 h-1/3 bg-slate-800 flex items-center justify-center text-white text-7xl rounded-lg">
            Lobby nie istnieje
        </div>
    </div>
</template>