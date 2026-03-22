import { uploadFile, sendMessage } from './chat-core.js';

export async function sendFile(chatId, senderId, file) {
    const uploaded = await uploadFile(file, senderId, 'files');
    await sendMessage(chatId, senderId, uploaded, 'file');
}