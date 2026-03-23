import RecordRTC from 'RecordRTC';
import { uploadFile, sendMessage } from './chat-core.js';

let recorder;
let stream;

export async function startVideoMessageRecording() {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    recorder = new RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/webm',
        video: { width: 320, height: 320 }
    });
    recorder.startRecording();
}

export async function stopVideoMessageRecording(chatId, senderId) {
    recorder.stopRecording(async () => {
        const blob = recorder.getBlob();
        const file = new File([blob], `video_${Date.now()}.webm`, { type: 'video/webm' });
        const uploaded = await uploadFile(file, senderId, 'video');
        await sendMessage(chatId, senderId, uploaded.url, 'video');
        stream.getTracks().forEach(track => track.stop());
    });
}

export function playVideoMessage(url) {
    const video = document.createElement('video');
    video.src = url;
    video.controls = true;
    video.style.maxWidth = '300px';
    document.body.appendChild(video);
    video.play();
}
