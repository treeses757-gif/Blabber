import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyC-iLxizH1umfeHSUZHLvpAt6XNm21p90Y",
    authDomain: "tanksduel-b90c7.firebaseapp.com",
    projectId: "tanksduel-b90c7",
    storageBucket: "tanksduel-b90c7.firebasestorage.app",
    messagingSenderId: "952596856224",
    appId: "1:952596856224:web:9ee265f302d82d3269f8c5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);