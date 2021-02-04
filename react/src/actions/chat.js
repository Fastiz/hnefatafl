export const SEND_CHAT_MESSAGE = "SEND_CHAT_MESSAGE";
export function sendChatMessage(message){
    return {
        type: SEND_CHAT_MESSAGE,
        message
    }
}

export const CHAT_MESSAGE = "CHAT_MESSAGE";
export function chatMessage(from, message){
    return {
        type: CHAT_MESSAGE,
        from, message
    }
}

export const INITIALIZE_CHAT = "INITIALIZE_CHAT";
export function initializeChat(){
    return {
        type: INITIALIZE_CHAT
    }
}