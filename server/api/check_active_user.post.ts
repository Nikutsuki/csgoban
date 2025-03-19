import { LobbySchema } from "../models/lobby"

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const id = body.id;
        const user_id = body.user_id; // This can be a random generated ID for the user session
        const team = body.team; // The team the user has selected

        return await LobbySchema.findOne({}).where("id").equals(id)
        .then((data) => {
            if(!data) {
                setResponseStatus(event, 404);
                return {
                    status: "error",
                    message: "Lobby not found"
                }
            }

            // Determine which team's active user to check based on the selected team
            const currentTime = new Date();
            let activeUser, lastActivityTime, timeDifference;
            
            if (team === data.t1_name) {
                // User selected team 1
                activeUser = data.active_user_team1;
                lastActivityTime = data.last_activity_team1 ? new Date(data.last_activity_team1) : null;
                timeDifference = lastActivityTime ? (currentTime.getTime() - lastActivityTime.getTime()) : 31000; // Default to more than timeout
                
                // If there's an active user for team 1 who's not the current user and they've been active in the last 30 seconds
                if (activeUser && activeUser !== user_id && timeDifference < 30000) {
                    setResponseStatus(event, 403); // Forbidden
                    return {
                        status: "error",
                        message: "Another user is currently active for this team",
                        active_user: activeUser,
                        time_remaining: Math.ceil((30000 - timeDifference) / 1000) // Time remaining in seconds
                    }
                }
                
                // Update the active user and last activity time for team 1
                data.active_user_team1 = user_id;
                data.last_activity_team1 = currentTime;
            } else if (team === data.t2_name) {
                // User selected team 2
                activeUser = data.active_user_team2;
                lastActivityTime = data.last_activity_team2 ? new Date(data.last_activity_team2) : null;
                timeDifference = lastActivityTime ? (currentTime.getTime() - lastActivityTime.getTime()) : 31000; // Default to more than timeout
                
                // If there's an active user for team 2 who's not the current user and they've been active in the last 30 seconds
                if (activeUser && activeUser !== user_id && timeDifference < 30000) {
                    setResponseStatus(event, 403); // Forbidden
                    return {
                        status: "error",
                        message: "Another user is currently active for this team",
                        active_user: activeUser,
                        time_remaining: Math.ceil((30000 - timeDifference) / 1000) // Time remaining in seconds
                    }
                }
                
                // Update the active user and last activity time for team 2
                data.active_user_team2 = user_id;
                data.last_activity_team2 = currentTime;
            } else {
                // Invalid team selection
                setResponseStatus(event, 400);
                return {
                    status: "error",
                    message: "Invalid team selection"
                }
            }
            
            return data.save()
            .then(() => {
                setResponseStatus(event, 200);
                return {
                    status: "success",
                    message: "User activity updated",
                    active_user: user_id,
                    team: team
                }
            })
        })
    } catch (error) {
        return {
            status: "error",
            message: error.message
        }
    }
})