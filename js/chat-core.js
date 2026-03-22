import { db } from './firebase-init.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, query, onSnapshot, arrayUnion, arrayRemove } from 'firebase/firestore';
import { storage } from './firebase-init.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function sendMessage(chatId, senderId, content, type = 'text', replyTo = null) {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const message = {
        type,
        senderId,
        timestamp: serverTimestamp(),
        replyTo,
        readBy: [senderId],
        reactions: {}
    };
    if (type === 'text') message.text = content;
    if (type === 'file') message.fileUrl = content.url, message.fileName = content.name, message.fileSize = content.size;
    if (type === 'voice') message.audioUrl = content;
    if (type === 'video') message.videoUrl = content;
    if (type === 'sticker') message.stickerId = content;
    await addDoc(messagesRef, message);
}

export async function uploadFile(file, userId, type = 'file') {
    const fileRef = ref(storage, `${type}s/${userId}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return { url, name: file.name, size: file.size };
}

export async function editMessage(chatId, messageId, newText) {
    const messageRef = doc(db, 'chats', chatId, 'messages', messageId);
    await updateDoc(messageRef, { text: newText, edited: true });
}

export async function deleteMessage(chatId, messageId, forEveryone = true) {
    if (forEveryone) {
        await deleteDoc(doc(db, 'chats', chatId, 'messages', messageId));
    } else {
        await updateDoc(doc(db, 'chats', chatId, 'messages', messageId), { deletedForMe: arrayUnion(auth.currentUser.uid) });
    }
}

export async function addReaction(chatId, messageId, userId, emoji) {
    const messageRef = doc(db, 'chats', chatId, 'messages', messageId);
    await updateDoc(messageRef, {
        [`reactions.${emoji}`]: arrayUnion(userId)
    });
}