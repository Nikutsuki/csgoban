import { defineMongooseModel } from "#nuxt/mongoose"

export const LobbySchema = defineMongooseModel({
    name: "Lobby",
    schema: {
        id: {
            type: String,
            unique: true,
            required: true,
        },
        banned_maps: {
            type: [String],
            required: true,
        },
        all_maps: {
            type: [String],
            required: true,
        },
        t1_name: {
            type: String,
            required: true,
        },
        t2_name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        starts: {
            type: String,
            required: true,
        },
        team_turn: {
            type: String,
            required: false,
        },
        map1: {
            type: String,
            required: false,
        },
        map2: {
            type: String,
            required: false,
        },
        map3: {
            type: String,
            required: false,
        },
        side_choice_phase: {
            type: Boolean,
            required: false,
        },
        maps_spect: [
            {
                name: {
                    type: String,
                    required: false,
                },
                picked: {
                    type: Boolean,
                    required: false,
                },
                banned: {
                    type: Boolean,
                    required: false,
                },
                is_decider: {
                    type: Boolean,
                    required: false,
                },
                team: {
                    type: String,
                    required: false,
                },
                team_number: {
                    type: Number,
                    required: false,
                },
                side_choice: {
                    type: String,
                    required: false,
                }
            }
        ]
    }
})