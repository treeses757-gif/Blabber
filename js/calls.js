import { db, auth } from './firebase-init.js';
import { doc, setDoc, updateDoc, onSnapshot, deleteDoc, getDoc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';

let currentCall = null;
let localStream = null;
let peer = null;

// Используем глобальный SimplePeer, если он доступен
const Peer = window.SimplePeer;

if (!Peer) {
    console.warn('SimplePeer не загружен, звонки недоступны');
}

export async function startCall(chatId, isVideo = true, isScreenShare = false) {
    if (!Peer) {
        alert('Звонки недоступны: не загружена библиотека WebRTC');
        return;
    }
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: isVideo });
        if (isScreenShare) {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            screenStream.getVideoTracks()[0].onended = () => stopScreenShare();
            localStream.addTrack(screenStream.getVideoTracks()[0]);
        }

        const callId = `call_${chatId}_${Date.now()}`;
        const callDoc = doc(db, 'calls', callId);
        await setDoc(callDoc, {
            chatId,
            callerId: auth.currentUser.uid,
            status: 'waiting',
            createdAt: serverTimestamp()
        });

        peer = new Peer({ initiator: true, stream: localStream, trickle: false });
        peer.on('signal', async (signal) => {
            await updateDoc(callDoc, { offer: signal });
        });
        peer.on('stream', (remoteStream) => {
            showCallUI(remoteStream, localStream);
        });
        peer.on('error', (err) => console.error('Peer error:', err));

        onSnapshot(callDoc, async (snap) => {
            const data = snap.data();
            if (data.answer && peer && !peer.destroyed) {
                peer.signal(data.answer);
            }
            if (data.status === 'ended') {
                endCall();
            }
        });
    } catch (err) {
        console.error('Start call error:', err);
        alert('Не удалось начать звонок');
    }
}

export async function answerCall(callId) {
    if (!Peer) {
        alert('Звонки недоступны: не загружена библиотека WebRTC');
        return;
    }
    const callDoc = doc(db, 'calls', callId);
    const snap = await getDoc(callDoc);
    const data = snap.data();
    if (!data) return;
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    peer = new Peer({ initiator: false, stream: localStream, trickle: false });
    peer.on('signal', async (signal) => {
        await updateDoc(callDoc, { answer: signal });
    });
    peer.on('stream', (remoteStream) => {
        showCallUI(remoteStream, localStream);
    });
    peer.signal(data.offer);
}

export function endCall() {
    if (peer) peer.destroy();
    if (localStream) localStream.getTracks().forEach(track => track.stop());
    if (currentCall) deleteDoc(doc(db, 'calls', currentCall));
    hideCallUI();
}

function showCallUI(remoteStream, localStream) {
    // Реализуйте отображение видео
    console.log('Call started');
}

function hideCallUI() {
    console.log('Call ended');
}

async function stopScreenShare() {
    // Реализуйте остановку демонстрации экрана
}
