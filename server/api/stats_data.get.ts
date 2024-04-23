import { LobbySchema } from "../models/lobby"

export default defineEventHandler(async (event) => {
    try {
        return await LobbySchema.find({})
    } catch (error) {
        return error
    }
})