import { db, storage } from './firebase-init.js';
import { collection, addDoc, query, where, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function addStory(userId, file, type = 'image') {
    const storyRef = ref(storage, `stories/${userId}/${Date.now()}`);
    await uploadBytes(storyRef, file);
    const url = await getDownloadURL(storyRef);
    await addDoc(collection(db, 'stories'), {
        userId,
        mediaUrl: url,
        type,
        timestamp: serverTimestamp(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
    });
}

export async function getActiveStories(userIds) {
    const q = query(collection(db, 'stories'), where('userId', 'in', userIds), where('expiresAt', '>', new Date()));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
}