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
            if(side == "tt") {
                maps_spect[maps_spect.length - 1].side_choice = "tt"
            }
            else {
                maps_spect[maps_spect.length - 1].side_choice = "ct"
            }
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