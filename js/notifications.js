import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from './firebase-init.js';

const messaging = getMessaging(app);

export async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
        // сохранить токен в Firestore
        return token;
    }
}

onMessage(messaging, (payload) => {
    new Notification(payload.notification.title, { body: payload.notification.body });
});