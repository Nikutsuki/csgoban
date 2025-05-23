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
let action_message = ref("") // Added for notification message
let user_id = ref("") // Unique ID for this user session
let another_user_active = ref(false) // Flag to indicate if another user is active
let time_remaining = ref(0) // Time remaining until session expires
let countdown_interval = ref(null) // Interval for countdown timer

// Generate a random user ID for this session
function generateUserId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Start countdown timer for session availability
function startCountdown(seconds) {
    // Clear any existing interval
    if (countdown_interval.value) {
        clearInterval(countdown_interval.value);
    }
    
    time_remaining.value = seconds;
    
    countdown_interval.value = setInterval(() => {
        if (time_remaining.value <= 0) {
            clearInterval(countdown_interval.value);
            countdown_interval.value = null;
            another_user_active.value = false;
            checkActiveUser(); // Try to claim the session
            return;
        }
        time_remaining.value--;
        updateSessionMessage();
    }, 1000);
}

// Update the message about session availability
function updateSessionMessage() {
    if (another_user_active.value && time_remaining.value > 0) {
        action_message.value = `Inny użytkownik jest aktywny dla tej drużyny. Dostęp będzie możliwy za ${time_remaining.value} sekund.`;
    }
}

// Check if this user is allowed to access the lobby
async function checkActiveUser() {
    if (!user_id.value) {
        user_id.value = generateUserId();
    }
    
    try {
        const response = await fetch('/api/check_active_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: lobby_id.value,
                user_id: user_id.value,
                team: team_selected.value // Send the selected team to the API
            })
        });
        
        const data = await response.json();
        
        if (response.status === 403) {
            // Another user is active for this team
            another_user_active.value = true;
            
            // If time_remaining is provided, start countdown
            if (data.time_remaining) {
                startCountdown(data.time_remaining);
            } else {
                action_message.value = "Inny użytkownik jest aktywny dla tej drużyny. Wybierz drugą drużynę lub spróbuj ponownie później.";
            }
            return false;
        } else if (response.status === 200) {
            // This user is now active for this team
            another_user_active.value = false;
            if (countdown_interval.value) {
                clearInterval(countdown_interval.value);
                countdown_interval.value = null;
            }
            return true;
        }
    } catch (error) {
        console.error("Error checking active user:", error);
    }
    
    return false;
}

// Update user activity periodically
function startActivityTracking() {
    // Only start tracking after a team is selected
    if (!team_selected.value) return;
    
    // Check initially
    checkActiveUser();
    
    // Then check every 15 seconds
    setInterval(async () => {
        if (team_selected.value && !another_user_active.value) {
            await checkActiveUser();
        }
    }, 15000);
}

// Function to handle team selection
function team_select(team: string) {
    team_selected.value = team;
    // Start activity tracking after team selection
    startActivityTracking();
}

// Handle page visibility changes to detect when user leaves the page
onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    if (countdown_interval.value) {
        clearInterval(countdown_interval.value);
    }
});

function handleVisibilityChange() {
    // When page becomes hidden (user switches tabs or leaves the page)
    if (document.visibilityState === 'hidden') {
        console.log('User left the page');
        // We don't need to do anything here as the session will expire naturally
        // after 30 seconds of inactivity
    } else if (document.visibilityState === 'visible' && team_selected.value) {
        // When page becomes visible again and team is selected, check if we can still use the session
        checkActiveUser();
    }
}

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
                update_action_message() // Added to set initial message
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
        // Updated bo3 logic
        // For bo3, we need to check if there's a map that needs a side choice
        for (let i = 0; i < maps_spect.value.length; i++) {
            // Only show side choice for picked maps that aren't deciders and don't have a side choice yet
            if (maps_spect.value[i].picked && !maps_spect.value[i].is_decider && maps_spect.value[i].side_choice === "") {
                choose_side.value = true
                return;
            }
        }
        choose_side.value = false
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
                update_action_message() // Added to update message on data change
            }
        })
}

// Function to update the action message based on game type and current state
function update_action_message() {
    // If another user is active, keep showing that message
    if (another_user_active.value) {
        // The message is already being updated by updateSessionMessage
        return;
    }
    
    // Check if side choice phase is active
    if (side_choice_phase.value) {
        // If it's the player's turn, show the side choice message
        if (turn.value === team_selected.value) {
            action_message.value = "Wybierz stronę na której będziesz zaczynać" // Choose side for the selected map
        } else {
            // If it's opponent's turn, show that opponent is choosing side
            action_message.value = "Przeciwnik wybiera stronę"
        }
        return
    }
    
    // Check if all maps have been selected/banned based on game type
    let allMapsSelected = false;
    if (type.value === "bo1" && banned_maps.value.length >= 6) {
        allMapsSelected = true;
    } else if (type.value === "bo3" && banned_maps.value.length >= 6) {
        allMapsSelected = true;
    } else if (type.value === "bo5" && banned_maps.value.length >= 6) {
        allMapsSelected = true;
    }
    
    // If all maps are selected, show the decider message regardless of whose turn it is
    if (allMapsSelected) {
        if (type.value === "bo1") {
            action_message.value = "Wszystkie mapy zostały zbanowane. Ostatnia mapa zostanie wybrana automatycznie."
        } else {
            action_message.value = "Wszystkie mapy zostały wybrane. Ostatnia mapa będzie deciderem."
        }
        return;
    }
    
    // Check if it's opponent's turn
    if (turn.value !== team_selected.value) {
        action_message.value = "Kolej przeciwnika"
        return
    }
    
    // Base message for player's turn
    let baseMessage = ""
    
    if (type.value === "bo1") {
        if (banned_maps.value.length < 6) {
            baseMessage = "Banuj mapę - pozostałe mapy: " + (6 - banned_maps.value.length)
        } else {
            baseMessage = "Wszystkie mapy zostały zbanowane. Ostatnia mapa zostanie wybrana automatycznie."
        }
    } else if (type.value === "bo3") {
        if (banned_maps.value.length < 2) {
            baseMessage = "Banuj mapę - pozostałe bany: " + (2 - banned_maps.value.length)
        } else if (banned_maps.value.length >= 2 && banned_maps.value.length < 4) {
            baseMessage = "Wybierz mapę - pozostałe wybory: " + (4 - banned_maps.value.length)
        } else if (banned_maps.value.length >= 4 && banned_maps.value.length < 6) {
            baseMessage = "Banuj mapę - pozostałe bany: " + (6 - banned_maps.value.length)
        } else {
            baseMessage = "Wszystkie mapy zostały wybrane. Ostatnia mapa będzie deciderem."
        }
    } else if (type.value === "bo5") {
        if (banned_maps.value.length < 2) {
            baseMessage = "Banuj mapę - pozostałe bany: " + (2 - banned_maps.value.length)
        } else if (banned_maps.value.length >= 2 && banned_maps.value.length < 6) {
            baseMessage = "Wybierz mapę - pozostałe wybory: " + (6 - banned_maps.value.length)
        } else {
            baseMessage = "Wszystkie mapy zostały wybrane. Ostatnia mapa będzie deciderem."
        }
    }
    
    action_message.value = baseMessage
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
            <div v-if="team_selected && !another_user_active" class="flex flex-col justify-center items-center">
                <!-- Added notification message at the top -->
                <div v-if="action_message" class="absolute top-4 left-0 right-0 mx-auto w-fit bg-slate-800 text-white p-4 rounded-lg text-xl font-bold z-10">
                    {{ action_message }}
                </div>
                <div v-if="choose_side">
                    <SideChoosePopup :id="lobby_id" :route="url.origin" :map="maps_spect[maps_spect.length - 1].name" @ct="choose_ct" @tt="choose_tt" />
                </div>
                <div v-else>
                    <div class="relative inset-y-40 text-7xl text-white text">
                        <div class="flex justify-center items-center">
                            {{ team_selected }}
                        </div>
                        <!-- Only show turn messages if not all maps are selected -->
                        <template v-if="!(type === 'bo1' && banned_maps.length >= 6) && !(type === 'bo3' && banned_maps.length >= 6) && !(type === 'bo5' && banned_maps.length >= 6)">
                            <div v-if="turn == team_selected" class="flex justify-center items-center">
                                Twoja kolej
                            </div>
                            <div v-else class="flex justify-center items-center">
                                Kolej przeciwnika
                            </div>
                        </template>
                    </div>
                    <div class="flex">
                        <li v-for="map in maps" :key="map" class="list-none">
                            <Map :map="map.map" :banned="map.banned" :picked="map.picked" :team="map.team" @click="ban_map(map)" />
                        </li>
                    </div>
                </div>
            </div>
            <div v-else-if="another_user_active" class="w-1/3 h-1/3 bg-slate-800 flex items-center justify-center text-white text-3xl rounded-lg p-6 text-center">
                {{ action_message }}
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
