import { LobbySchema } from "../models/lobby"

export default defineEventHandler(async (event) => {
    try {
        const id = getQuery(event).id
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
            setResponseStatus(event, 200);
            return {
                data
            }
        })
    } catch (error) {
        return error
    }
})