import { db, auth } from './firebase-init.js';
import { collection, addDoc, onSnapshot, query, where, serverTimestamp } from 'firebase/firestore';

export function initBotListener() {
    const user = auth.currentUser;
    if (!user) return;
    // В реальном проекте можно слушать команды в активном чате
    // Здесь для примера – просто заглушка
    console.log('Bot listener initialized');
}

// Функция для вызова облачной функции (бот-сервер)
export async function sendBotCommand(chatId, command) {
    const response = await fetch('https://your-cloud-function-url/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, userId: auth.currentUser.uid, command })
    });
    const data = await response.json();
    if (data.reply) {
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        await addDoc(messagesRef, {
            text: data.reply,
            senderId: 'bot',
            timestamp: serverTimestamp(),
            type: 'text'
        });
    }
}