import { db } from './firebase-init.js';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function searchMessages(chatId, searchTerm) {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, where('text', '>=', searchTerm), where('text', '<=', searchTerm + '\uf8ff'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}