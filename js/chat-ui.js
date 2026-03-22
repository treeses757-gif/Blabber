import { sendMessage } from './chat-core.js';
import { startVoiceRecording, stopVoiceRecording, playVoiceMessage } from './voice-messages.js';
import { startVideoRecording, stopVideoRecording, playVideoMessage } from './video-messages.js';
import { startCall } from './calls.js';

let currentChatId = null;
let currentUser = null;

export function initUI(user) {
    currentUser = user;
    renderChatArea();
    attachEventHandlers();
}

function renderChatArea() {
    const chatArea = document.getElementById('chatArea');
    if (!chatArea) return;
    chatArea.innerHTML = `
        <div class="chat-header">
            <div class="chat-title">Blabber</div>
            <div class="chat-actions">
                <button id="voiceCallBtn">🎧 Аудио</button>
                <button id="videoCallBtn">📹 Видео</button>
                <button id="screenShareBtn">🖥️ Экран</button>
                <button id="addFileBtn">📎 Файл</button>
                <button id="recordVoiceBtn">🎤 Голос</button>
                <button id="recordVideoBtn">📹 Кружок</button>
            </div>
        </div>
        <div class="messages-list" id="messagesList"></div>
        <div class="input-area">
            <input type="text" id="messageInput" placeholder="Сообщение...">
            <button id="sendBtn">➤</button>
        </div>
    `;
}

function attachEventHandlers() {
    document.getElementById('sendBtn')?.addEventListener('click', sendTextMessage);
    document.getElementById('messageInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendTextMessage();
    });
    document.getElementById('recordVoiceBtn')?.addEventListener('click', toggleVoiceRecording);
    document.getElementById('recordVideoBtn')?.addEventListener('click', toggleVideoRecording);
    document.getElementById('voiceCallBtn')?.addEventListener('click', () => startCall(currentChatId, false));
    document.getElementById('videoCallBtn')?.addEventListener('click', () => startCall(currentChatId, true));
    document.getElementById('screenShareBtn')?.addEventListener('click', () => startCall(currentChatId, true, true));
    document.getElementById('addFileBtn')?.addEventListener('click', () => document.getElementById('fileInput')?.click());
}

async function sendTextMessage() {
    const input = document.getElementById('messageInput');
    const text = input?.value.trim();
    if (!text || !currentChatId || !currentUser) return;
    await sendMessage(currentChatId, currentUser.uid, text, 'text');
    input.value = '';
}

let isRecordingVoice = false;
function toggleVoiceRecording() {
    if (isRecordingVoice) {
        stopVoiceRecording();
        isRecordingVoice = false;
    } else {
        startVoiceRecording(currentChatId, currentUser.uid);
        isRecordingVoice = true;
    }
}

let isRecordingVideo = false;
function toggleVideoRecording() {
    if (isRecordingVideo) {
        stopVideoRecording();
        isRecordingVideo = false;
    } else {
        startVideoRecording(currentChatId, currentUser.uid);
        isRecordingVideo = true;
    }
}
