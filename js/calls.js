import { db } from './firebase-init.js';
import { collection, doc, setDoc, updateDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import Peer from 'simple-peer';

let currentCall = null;
let localStream = null;
let peer = null;

export async function startCall(chatId, isVideo = true, isScreenShare = false) {
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
        createdAt: new Date().toISOString()
    });

    peer = new Peer({ initiator: true, stream: localStream, trickle: false });
    peer.on('signal', async (signal) => {
        await updateDoc(callDoc, { offer: signal });
    });
    peer.on('stream', (remoteStream) => {
        showCallUI(remoteStream, localStream);
    });

    onSnapshot(callDoc, async (snap) => {
        const data = snap.data();
        if (data.answer && !peer.destroyed) {
            peer.signal(data.answer);
        }
        if (data.status === 'ended') {
            endCall();
        }
    });
}

export async function answerCall(callId) {
    const callDoc = doc(db, 'calls', callId);
    const snap = await getDoc(callDoc);
    const data = snap.data();
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

async function stopScreenShare() {
    // удалить видео-трек экрана
}