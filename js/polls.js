import { db } from './firebase-init.js';
import { collection, addDoc, updateDoc, doc, arrayUnion, serverTimestamp } from 'firebase/firestore';

export async function createPoll(chatId, question, options, createdBy) {
    const pollRef = await addDoc(collection(db, 'polls'), {
        question,
        options: options.map(opt => ({ text: opt, votes: [] })),
        createdBy,
        chatId,
        createdAt: serverTimestamp()
    });
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
        type: 'poll',
        pollId: pollRef.id,
        senderId: createdBy,
        timestamp: serverTimestamp()
    });
}

export async function vote(pollId, optionIndex, userId) {
    const pollRef = doc(db, 'polls', pollId);
    await updateDoc(pollRef, {
        [`options.${optionIndex}.votes`]: arrayUnion(userId)
    });
}