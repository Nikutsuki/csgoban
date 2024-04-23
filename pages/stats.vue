<script setup lang="ts">
let stats_bans = reactive(new Map())
let stats_picks = reactive(new Map())
let team_selected = ref('')
let all_maps = ref([])

let stats = ref([])

function update_bans(bans) {
    for (let i = 0; i < bans.length; i++) {
        if (bans[i].banned === false) continue;
        if (!stats_bans.has(bans[i].team)) {
            stats_bans.set(bans[i].team, new Map())
        }
        let count = stats_bans.get(bans[i].team).get(bans[i].name) || 0
        stats_bans.get(bans[i].team).set(bans[i].name, count + 1)
    }
}

function update_picks(picks) {
    for (let i = 0; i < picks.length; i++) {
        if (picks[i].picked === false) continue;
        if (!stats_picks.has(picks[i].team)) {
            stats_picks.set(picks[i].team, new Map())
        }
        let count = stats_picks.get(picks[i].team).get(picks[i].name) || 0
        stats_picks.get(picks[i].team).set(picks[i].name, count + 1)
    }
}

async function iter() {
    let data = await request_stats()
    for (let i = 0; i < data[0].all_maps.length; i++) {
        all_maps.value.push(data[0].all_maps[i].toLowerCase())
    }
    for (let i = 0; i < data.length; i++) {
        update_bans(data[i].maps_spect)
        update_picks(data[i].maps_spect)
    }
}

async function request_stats() {
    let data;
    await fetch(`/api/stats_data`)
        .then(async res => {
            let json = await res.json();
            data = json
        })
    return data
}

onMounted(() => {
    iter()
    console.log(stats_bans)
    console.log(stats_picks)
})

function team_select(team) {
    team_selected.value = team
    for (let i = 0; i < all_maps.value.length; i++) {
        let map = all_maps.value[i].toLowerCase()
        let picks = stats_picks.get(team)
        let bans = stats_bans.get(team)
        console.log(picks)
        console.log(bans)
        let pick_count = picks.get(map) || 0
        let ban_count = bans.get(map) || 0
        stats.value.push({
            map: map,
            picks: pick_count,
            bans: ban_count
        })
    }
}

function go_back() {
    team_selected.value = ''
    stats.value = []
}

</script>

<template>
    <div class="justify-center items-center flex bg-slate-600 w-full h-screen">
        <div class="back_button bg-slate-700 p-4 rounded-lg btn_border" @click="go_back()">
            Go back
        </div>
        <div v-if="team_selected == ''" class="flex">
            <TeamName v-for="(value, key) in stats_bans" :team_name="value[0]" @click="team_select(value[0])" />
        </div>
        <div v-else class="flex-col flex items-center justify-center h-screen w-full">
            <TeamName :team_name="team_selected" />
            <div class="flex">
                <li v-for="map in stats" :key="map" class="list-none">
                    <MapStats :map="map.map" :picks="map.picks" :bans="map.bans" />
                </li>
            </div>
        </div>
    </div>
</template>

<style>
.back_button {
    color: white;
    font-size: 20px;
    position: absolute;
    top: 20px;
    left: 30px;
}

    .btn_border {
        --tw-bg-opacity: 1;
        background-color: rgb(30 41 59 / var(--tw-bg-opacity));
        display: flex;
        justify-content: center;
        align-items: center;
        --tw-text-opacity: 1;
        color: rgb(255 255 255 / var(--tw-text-opacity));
        line-height: 1;
        border-radius: 0.5rem;
        padding: 0.5rem;
        transition: background-color 0.3s ease;
    }

    .btn_border:hover {
        --tw-bg-opacity: 1;
        background-color: #fbff0057;
    }
</style>