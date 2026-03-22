import { db, auth } from './firebase-init.js';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, getDocs, collection, query, where } from 'firebase/firestore';

export async function addContact(contactUsername) {
    const currentUser = auth.currentUser;
    const currentUserDoc = await getDoc(doc(db, 'users', currentUser.uid));
    if (currentUserDoc.data().username === contactUsername) {
        throw new Error('Cannot add yourself');
    }
    const q = query(collection(db, 'users'), where('username', '==', contactUsername));
    const snapshot = await getDocs(q);
    if (snapshot.empty) throw new Error('User not found');
    const contactDoc = snapshot.docs[0];
    const contactId = contactDoc.id;
    await updateDoc(doc(db, 'users', currentUser.uid), {
        contacts: arrayUnion(contactId)
    });
    return { id: contactId, username: contactDoc.data().username };
}

export async function removeContact(contactId) {
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        contacts: arrayRemove(contactId)
    });
}

export async function getContacts() {
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
    const contactIds = userDoc.data().contacts || [];
    const contacts = [];
    for (const id of contactIds) {
        const contactSnap = await getDoc(doc(db, 'users', id));
        if (contactSnap.exists()) {
            contacts.push({ id, ...contactSnap.data() });
        }
    }
    return contacts;
}