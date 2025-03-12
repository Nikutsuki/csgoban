export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const id = body.id
        const side = body.side
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
            let maps_spect = data.maps_spect
            data.side_choice_phase = false
            
            // Find the map that needs a side choice (picked, not decider, no side choice yet)
            let mapIndex = -1;
            for (let i = 0; i < maps_spect.length; i++) {
                if (maps_spect[i].picked && !maps_spect[i].is_decider && maps_spect[i].side_choice === "") {
                    mapIndex = i;
                    break;
                }
            }
            
            // If no map found that needs a side choice, default to the last map
            if (mapIndex === -1) {
                mapIndex = maps_spect.length - 1;
            }
            
            if(side == "tt") {
                maps_spect[mapIndex].side_choice = "tt"
            }
            else {
                maps_spect[mapIndex].side_choice = "ct"
            }
            let side_choice_team = data.team_turn == data.t1_name ? data.t1_name : data.t2_name
            maps_spect[mapIndex].side_choice_team = side_choice_team
            return data.save()
            .then((data) => {
                return {
                    statusCode: 200,
                    body: JSON.stringify(data)
                }
            })
        })
    } catch (error) {
        return error
    }
})