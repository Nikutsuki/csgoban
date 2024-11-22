import { LobbySchema } from "../models/lobby"

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const t1_name = body.t1_name
        const t2_name = body.t2_name
        const id = body.id
        const banned_maps = body.banned_maps
        const all_maps = ["Ancient", "Anubis", "Inferno", "Mirage", "Nuke", "Dust II", "Vertigo"]
        const starts = body.starts;
        const type = body.type;
        const team_turn = starts;
        return await new LobbySchema({
            t1_name,
            t2_name,
            id,
            banned_maps,
            all_maps,
            starts,
            type,
            team_turn
        })
        .save()
        .then((data) => {
            return {
                statusCode: 200,
                body: JSON.stringify(data)
            }
        })
    } catch (error) {
        return error
    }
})
