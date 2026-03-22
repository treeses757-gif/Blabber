import { db, auth } from './firebase-init.js';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase-init.js';

export async function getUserProfile(userId) {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data();
    }
    return null;
}

export async function updateProfile(data) {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, data);
}

export async function setAvatar(file) {
    const user = auth.currentUser;
    const avatarRef = ref(storage, `avatars/${user.uid}`);
    await uploadBytes(avatarRef, file);
    const url = await getDownloadURL(avatarRef);
    await updateDoc(doc(db, 'users', user.uid), { avatarUrl: url });
    return url;
}

export async function setStatus(status) {
    await updateDoc(doc(db, 'users', auth.currentUser.uid), { status });
}