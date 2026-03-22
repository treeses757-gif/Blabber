import { db } from './firebase-init.js';
import { doc, updateDoc, runTransaction } from 'firebase/firestore';

export async function sendPayment(recipientId, amount, currency = 'usd') {
    // В реальном проекте вызовите Cloud Function для Stripe
    console.log(`Sending payment ${amount} ${currency} to ${recipientId}`);
    // Заглушка: имитация успеха
    return { success: true };
}

export async function transferCoins(senderId, recipientId, amount) {
    const senderRef = doc(db, 'users', senderId);
    const recipientRef = doc(db, 'users', recipientId);
    await runTransaction(db, async (transaction) => {
        const senderDoc = await transaction.get(senderRef);
        const recipientDoc = await transaction.get(recipientRef);
        const senderBalance = senderDoc.data().coins || 0;
        const recipientBalance = recipientDoc.data().coins || 0;
        if (senderBalance < amount) throw new Error('Insufficient coins');
        transaction.update(senderRef, { coins: senderBalance - amount });
        transaction.update(recipientRef, { coins: recipientBalance + amount });
    });
}