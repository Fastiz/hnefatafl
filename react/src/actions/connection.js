export const CONNECTED = "CONNECTED";
export function connected(){
    return {
        type: CONNECTED
    }
}

export const DISCONNECTED = "DISCONNECTED";
export function disconnected(){
    return {
        type: DISCONNECTED
    }
}

export const NUMBER_OF_PLAYERS = "NUMBER_OF_PLAYERS";
export function numberOfPlayers(amount){
    return {
        type: NUMBER_OF_PLAYERS,
        amount
    }
}

export const NUMBER_OF_MATCHES = "NUMBER_OF_MATCHES";
export function numberOfMatches(amount){
    return {
        type: NUMBER_OF_MATCHES,
        amount
    }
}