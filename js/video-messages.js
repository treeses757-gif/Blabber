import { uploadFile } from './chat-core.js';
import { sendMessage } from './chat-core.js';

let mediaRecorder;
let recordedChunks = [];
let stream;

export async function startVideoRecording(chatId, senderId) {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        mediaRecorder = new MediaRecorder(stream);
        recordedChunks = [];
        mediaRecorder.ondataavailable = e => recordedChunks.push(e.data);
        mediaRecorder.onstop = async () => {
            const blob = new Blob(recordedChunks, { type: 'video/mp4' });
            const file = new File([blob], `video_${Date.now()}.mp4`, { type: 'video/mp4' });
            const uploaded = await uploadFile(file, senderId, 'videos');
            await sendMessage(chatId, senderId, uploaded.url, 'video');
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
        mediaRecorder.start();
        // ограничение 60 секунд
        setTimeout(() => stopVideoRecording(), 60000);
    } catch (err) {
        console.error('Start video recording error:', err);
        alert('Не удалось начать запись видео');
    }
}

export function stopVideoRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
}

// Функция для воспроизведения видео-сообщения в интерфейсе
export function playVideoMessage(videoElement, videoUrl) {
    if (videoElement && videoUrl) {
        videoElement.src = videoUrl;
        videoElement.play().catch(e => console.error('Play error:', e));
    }
}
