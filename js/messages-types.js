export const MessageTypes = {
    TEXT: 'text',
    VOICE: 'voice',
    VIDEO: 'video',
    FILE: 'file',
    STICKER: 'sticker',
    POLL: 'poll',
    LOCATION: 'location',
    CONTACT: 'contact'
};

export function createTextMessage(text) {
    return { type: MessageTypes.TEXT, text };
}

export function createVoiceMessage(audioUrl) {
    return { type: MessageTypes.VOICE, audioUrl };
}

export function createVideoMessage(videoUrl) {
    return { type: MessageTypes.VIDEO, videoUrl };
}

export function createFileMessage(fileUrl, fileName, fileSize) {
    return { type: MessageTypes.FILE, fileUrl, fileName, fileSize };
}

export function createStickerMessage(stickerId) {
    return { type: MessageTypes.STICKER, stickerId };
}