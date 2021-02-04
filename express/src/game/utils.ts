import {SocketMessage} from "../broker";
import {ChatMessage, PieceMove} from "./gameInstance";
import {MESSAGES} from "./constants";

export function pieceMoveToSocketMessage(move: PieceMove): SocketMessage {
    return {
        event: MESSAGES.PIECE_MOVED,
        data: move
    };
}

export function chatMessageToSocketMessage(message: ChatMessage): SocketMessage {
    return {
        event: MESSAGES.CHAT_MESSAGE,
        data: message
    };
}