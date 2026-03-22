import { sendMessage } from './chat-core.js';

export function replyToMessage(chatId, originalMessage, replyText, senderId) {
    const replyData = {
        messageId: originalMessage.id,
        text: originalMessage.type === 'text' ? originalMessage.text : '[media]',
        senderName: originalMessage.senderName
    };
    sendMessage(chatId, senderId, replyText, 'text', replyData);
}

export function mentionUser(userId, userName) {
    return `@${userName}`;
}