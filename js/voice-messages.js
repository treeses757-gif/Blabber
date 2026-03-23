import { uploadFile, sendMessage } from './chat-core.js';
import { db } from './firebase-init.js';

let mediaRecorder;
let audioChunks = [];
let audioContext;
let source;

export async function startVoiceRecording(chatId, senderId) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    audioContext = new AudioContext();
    source = audioContext.createMediaStreamSource(stream);
    const filter = audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2000;
    source.connect(filter);
    const dest = audioContext.createMediaStreamDestination();
    filter.connect(dest);
    const processedStream = dest.stream;
    
    mediaRecorder = new MediaRecorder(processedStream);
    audioChunks = [];
    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
    mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunks, { type: 'audio/webm' });
        const file = new File([blob], `voice_${Date.now()}.webm`, { type: 'audio/webm' });
        const uploaded = await uploadFile(file, senderId, 'voice');
        await sendMessage(chatId, senderId, uploaded.url, 'voice');
        audioContext.close();
    };
    mediaRecorder.start();
}

export function stopVoiceRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
}

export function playVoiceMessage(url) {
    const audio = new Audio(url);
    audio.play();
}
