import { db, auth } from './firebase-init.js';
import { collection, doc, setDoc, updateDoc, onSnapshot, deleteDoc, getDoc } from 'firebase/firestore';
import Peer from 'simple-peer';

let currentCall = null;
let localStream = null;
let peer = null;
let remoteStream = null;
let callOverlay = null;

export function initCalls(user) {
    // Здесь можно подписаться на входящие звонки
}

export async function startCall(chatId, isVideo = true, isScreenShare = false) {
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
            createdAt: new Date().toISOString()
        });

        peer = new Peer({ initiator: true, stream: localStream, trickle: false });
        peer.on('signal', async (signal) => {
            await updateDoc(callDoc, { offer: signal });
        });
        peer.on('stream', (remoteStream) => {
            showCallUI(remoteStream, localStream);
        });
        peer.on('error', (err) => {
            console.error('Peer error:', err);
            endCall();
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
    } catch (err) {
        console.error('Error starting call:', err);
        throw err;
    }
}

export async function answerCall(callId) {
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
    peer.on('error', (err) => {
        console.error('Peer error:', err);
        endCall();
    });
    peer.signal(data.offer);
}

export function endCall() {
    if (peer) peer.destroy();
    if (localStream) localStream.getTracks().forEach(track => track.stop());
    if (remoteStream) remoteStream.getTracks().forEach(track => track.stop());
    if (currentCall) deleteDoc(doc(db, 'calls', currentCall));
    hideCallUI();
}

async function stopScreenShare() {
    if (localStream) {
        const screenTracks = localStream.getVideoTracks().filter(track => track.label.includes('screen'));
        screenTracks.forEach(track => {
            track.stop();
            localStream.removeTrack(track);
        });
    }
}

function showCallUI(remoteStream, localStream) {
    callOverlay = document.getElementById('callOverlay');
    if (!callOverlay) return;
    callOverlay.style.display = 'flex';
    callOverlay.innerHTML = `
        <div class="call-container">
            <video id="remoteVideo" autoplay playsinline></video>
            <video id="localVideo" autoplay playsinline muted></video>
            <button id="endCallBtn">End Call</button>
        </div>
    `;
    const remoteVideo = document.getElementById('remoteVideo');
    const localVideo = document.getElementById('localVideo');
    remoteVideo.srcObject = remoteStream;
    localVideo.srcObject = localStream;
    document.getElementById('endCallBtn').onclick = () => endCall();
}

function hideCallUI() {
    if (callOverlay) {
        callOverlay.style.display = 'none';
        callOverlay.innerHTML = '';
    }
}
