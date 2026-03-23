import { auth } from './firebase-init.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase-init.js';

export async function register(username, password) {
    const email = `${username}@temp.com`;
    try {
        // Проверяем, не занят ли username
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            throw new Error('Username already taken');
        }

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

export function showLogin() {
    const container = document.querySelector('.login-container');
    if (!container) return;
    container.innerHTML = `
        <div class="login-form">
            <h2>Login</h2>
            <input type="text" id="loginUsername" placeholder="Username">
            <input type="password" id="loginPassword" placeholder="Password">
            <button id="loginBtn">Login</button>
            <button id="registerBtn">Register</button>
        </div>
    `;
    document.getElementById('loginBtn').onclick = async () => {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        try {
            await login(username, password);
        } catch (err) {
            alert(err.message);
        }
    };
    document.getElementById('registerBtn').onclick = async () => {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        try {
            await register(username, password);
        } catch (err) {
            alert(err.message);
        }
    };
}
