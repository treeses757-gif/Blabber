import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from './firebase-init.js';

const messaging = getMessaging(app);

export async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
        console.log('FCM token:', token);
        return token;
    }
}

export function setupNotifications(user) {
    onMessage(messaging, (payload) => {
        new Notification(payload.notification.title, { body: payload.notification.body });
    });
}
