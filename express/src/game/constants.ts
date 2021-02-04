import {SocketMessage} from "../broker";

export const MESSAGES: {[index: string]: string} = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    MATCH_MAKING: 'match_making',
    MATCH_FOUND: 'match_found',
    PIECE_MOVED: 'piece_moved',
    CHAT_MESSAGE: 'chat_message'
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