import { LobbySchema } from "../models/lobby"

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const id = body.id
        const banned_map = body.banned_map
        const team = body.team
        return await LobbySchema.findOne({}).where("id").equals(id)
        .then((data) => {
            if(!data) {
                setResponseStatus(event, 404);
                return {
                    body: JSON.stringify({
                        message: "Lobby not found"
                    })
                }
            }
            const banned_maps = data.banned_maps
            const type = data.type
            banned_maps.push(banned_map)
            const team_number = team == data.t1_name ? 0 : 1
            if(type == "bo1") {
                const spect_map = {
                    name: banned_map,
                    picked: false,
                    banned: true,
                    team: team,
                    team_number: team_number,
                    is_decider: false
                }
                let spect_maps = data.maps_spect
                spect_maps.push(spect_map)
                if(banned_maps.length == 6) {
                    for(let i = 0; i < 7; i++) {
                        if(!banned_maps.includes(data.all_maps[i].toLowerCase())) {
                            data.map1 = data.all_maps[i].toLowerCase()
                            const spect_map = {
                                name: data.all_maps[i].toLowerCase(),
                                picked: true,
                                banned: false,
                                team: team,
                                team_number: team_number,
                                is_decider: true
                            }
                            spect_maps.push(spect_map)
                            break;
                        }
                    }
                }
                else {
                }
            }

            if(type == "bo3") {
                let spect_map = {
                    name: banned_map,
                    picked: false,
                    banned: true,
                    team: team,
                    team_number: team_number,
                    is_decider: false,
                    side_choice: "",
                    side_choice_team: ""
                }
                let spect_maps = data.maps_spect
                if(spect_maps.length == 2 || spect_maps.length == 3) {
                    spect_map.picked = true
                    spect_map.banned = false
                    if(spect_maps.length == 2) data.map1 = banned_map
                    if(spect_maps.length == 3) data.map2 = banned_map
                    data.side_choice_phase = true
                }
                data.maps_spect.push(spect_map)
                if(banned_maps.length == 6) {
                    for(let i = 0; i < 7; i++) {
                        if(!banned_maps.includes(data.all_maps[i].toLowerCase())) {
                            data.map3 = data.all_maps[i].toLowerCase()
                            const spect_map = {
                                name: data.all_maps[i].toLowerCase(),
                                picked: true,
                                banned: false,
                                team: team,
                                team_number: team_number,
                                is_decider: true,
                                side_choice: "",
                                side_choice_team: ""
                            }
                            spect_maps.push(spect_map)
                            break;
                        }
                    }
                }
                else {
                }
            }

            if(type == "bo5") {
                let spect_map = {
                    name: banned_map,
                    picked: false,
                    banned: true,
                    team: team,
                    team_number: team_number,
                    is_decider: false,
                    side_choice: "",
                    side_choice_team: ""
                }
                let spect_maps = data.maps_spect
                
                // First two entries are bans (one from each team)
                if(spect_maps.length < 2) {
                    data.maps_spect.push(spect_map)
                }
                // Next four entries are picks (alternating between teams)
                // After each pick, we need to set side_choice_phase to true
                else if(spect_maps.length >= 2 && spect_maps.length < 6) {
                    spect_map.picked = true
                    spect_map.banned = false
                    
                    // Assign maps to the appropriate map slots
                    if(spect_maps.length == 2) data.map1 = banned_map
                    if(spect_maps.length == 3) data.map2 = banned_map
                    if(spect_maps.length == 4) data.map3 = banned_map
                    if(spect_maps.length == 5) data.map4 = banned_map
                    
                    data.side_choice_phase = true
                    data.maps_spect.push(spect_map)
                    
                    // If we've just added the 4th pick (6th entry in maps_spect), automatically set the decider map
                    if(spect_maps.length == 6) {
                        // Find the remaining map that hasn't been banned or picked
                        for(let i = 0; i < 7; i++) {
                            if(!banned_maps.includes(data.all_maps[i].toLowerCase())) {
                                data.map5 = data.all_maps[i].toLowerCase()
                                const decider_map = {
                                    name: data.all_maps[i].toLowerCase(),
                                    picked: true,
                                    banned: false,
                                    team: team,
                                    team_number: team_number,
                                    is_decider: true,
                                    side_choice: "",
                                    side_choice_team: ""
                                }
                                data.maps_spect.push(decider_map)
                                break;
                            }
                        }
                    }
                }
                // The last remaining map is the decider (this is a fallback for the original logic)
                else if(banned_maps.length == 6) {
                    for(let i = 0; i < 7; i++) {
                        if(!banned_maps.includes(data.all_maps[i].toLowerCase())) {
                            data.map5 = data.all_maps[i].toLowerCase()
                            const decider_map = {
                                name: data.all_maps[i].toLowerCase(),
                                picked: true,
                                banned: false,
                                team: team,
                                team_number: team_number,
                                is_decider: true,
                                side_choice: "",
                                side_choice_team: ""
                            }
                            data.maps_spect.push(decider_map)
                            break;
                        }
                    }
                }
            }
        
            data.banned_maps = banned_maps
            if(team != data.team_turn) return;
            if(team == data.t1_name) data.team_turn = data.t2_name
            else data.team_turn = data.t1_name
            return data.save()
            .then((data) => {
                setResponseStatus(event, 200);
                return {
                    body: JSON.stringify(data)
                }
            })
        })
    } catch (error) {
        return error
    }
})