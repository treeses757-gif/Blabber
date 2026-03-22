import { storage, db } from './firebase-init.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

export async function uploadStickerPack(userId, packName, stickers) {
    const packRef = ref(storage, `stickers/${userId}/${packName}`);
    const urls = [];
    for (let i = 0; i < stickers.length; i++) {
        const stickerRef = ref(packRef, `${i}.png`);
        await uploadBytes(stickerRef, stickers[i]);
        const url = await getDownloadURL(stickerRef);
        urls.push(url);
    }
    await updateDoc(doc(db, 'users', userId), {
        stickerPacks: arrayUnion({ name: packName, stickers: urls })
    });
}