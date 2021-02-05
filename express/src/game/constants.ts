import {SocketMessage} from "../connection/Connection";

export const MESSAGES: {[index: string]: string} = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    MATCH_FOUND: 'match_found',
    PIECE_MOVED: 'piece_moved',
    CHAT_MESSAGE: 'chat_message',
    NUMBER_OF_MATCHES: 'number_of_matches',
    NUMBER_OF_PLAYERS: 'number_of_players',
    OPPONENT_DISCONNECTED: 'opponent_disconnected',
    LEAVE_GAME: 'leave_game'
};

export enum GameType {
    HNEFATAFL = "HNEFATAFL"
}

export enum Team {
    WHITE = "WHITE",
    BLACK = "BLACK"
}

export function matchFound({playerTeam}): SocketMessage {
    return {
        event: MESSAGES.MATCH_FOUND,
        data: {
            gameType: GameType.HNEFATAFL,
            teamTurn: Team.WHITE,
            playerTeam
        }
    };
}