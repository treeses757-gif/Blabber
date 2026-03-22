import { db } from './firebase-init.js';
import { collection, doc, setDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';

export async function createGroup(name, creatorId, memberIds = []) {
    const groupRef = doc(collection(db, 'groups'));
    await setDoc(groupRef, {
        name,
        createdBy: creatorId,
        members: [creatorId, ...memberIds],
        admins: [creatorId],
        createdAt: serverTimestamp(),
        settings: { isSuperGroup: false, topics: [] }
    });
    return groupRef.id;
}

export async function addMember(groupId, userId) {
    await updateDoc(doc(db, 'groups', groupId), {
        members: arrayUnion(userId)
    });
}

export async function createTopic(groupId, topicName) {
    const topicRef = doc(collection(db, 'groups', groupId, 'topics'));
    await setDoc(topicRef, {
        name: topicName,
        createdAt: serverTimestamp()
    });
}