import { db } from './firebase-init.js';
import { collection, doc, setDoc, addDoc, getDoc, getDocs, query, where, orderBy, serverTimestamp, arrayUnion, arrayRemove } from 'firebase/firestore';

export async function createChannel(name, description, creatorId) {
    const channelRef = doc(collection(db, 'channels'));
    await setDoc(channelRef, {
        name,
        description,
        createdBy: creatorId,
        subscribers: [creatorId],
        createdAt: serverTimestamp(),
        type: 'channel'
    });
    return channelRef.id;
}

export async function subscribeToChannel(channelId, userId) {
    await updateDoc(doc(db, 'channels', channelId), {
        subscribers: arrayUnion(userId)
    });
}

export async function unsubscribeFromChannel(channelId, userId) {
    await updateDoc(doc(db, 'channels', channelId), {
        subscribers: arrayRemove(userId)
    });
}

export async function sendChannelPost(channelId, content, senderId) {
    const postsRef = collection(db, 'channels', channelId, 'posts');
    await addDoc(postsRef, {
        text: content,
        senderId,
        timestamp: serverTimestamp()
    });
}

export async function getChannelPosts(channelId) {
    const q = query(collection(db, 'channels', channelId, 'posts'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}