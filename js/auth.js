import { auth } from './firebase-init.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase-init.js';

export async function register(username, password) {
    const email = `${username}@temp.com`;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
            username: username,
            contacts: [],
            createdAt: new Date().toISOString()
        });
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function login(username, password) {
    const email = `${username}@temp.com`;
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        throw new Error('Invalid username or password');
    }
}

export async function logout() {
    await signOut(auth);
}

export function onAuthState(callback) {
    return onAuthStateChanged(auth, callback);
}