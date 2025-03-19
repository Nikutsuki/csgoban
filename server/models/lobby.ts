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
        map4: {
            type: String,
            required: false,
        },
        map5: {
            type: String,
            required: false,
        },
        side_choice_phase: {
            type: Boolean,
            required: false,
        },
        // Replace single active_user with team-specific active users
        active_user_team1: {
            type: String,
            required: false,
        },
        active_user_team2: {
            type: String,
            required: false,
        },
        last_activity_team1: {
            type: Date,
            required: false,
        },
        last_activity_team2: {
            type: Date,
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
                },
                side_choice_team: {
                    type: String,
                    required: false,
                }
            }
        ]
    }
})