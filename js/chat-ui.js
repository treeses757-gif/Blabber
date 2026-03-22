import { sendMessage, addReaction } from './chat-core.js';
import { playVoiceMessage } from './voice-messages.js';
import { playVideoMessage } from './video-messages.js';

export function renderMessage(message, isOwn, chatId, currentUserId) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isOwn ? 'sent' : 'received'}`;
    messageDiv.dataset.id = message.id;

    const time = message.timestamp ? new Date(message.timestamp.toDate()).toLocaleTimeString() : '';
    let contentHtml = '';

    switch (message.type) {
        case 'text':
            contentHtml = `<div class="message-text">${escapeHtml(message.text)}</div>`;
            break;
        case 'voice':
            contentHtml = `
                <div class="voice-message">
                    <button class="voice-play-btn" data-url="${message.audioUrl}">Play</button>
                    <span class="voice-duration"></span>
                </div>`;
            break;
        case 'video':
            contentHtml = `<video src="${message.videoUrl}" controls width="200"></video>`;
            break;
        case 'file':
            contentHtml = `<a href="${message.fileUrl}" download>${message.fileName}</a>`;
            break;
        case 'sticker':
            contentHtml = `<img src="${message.stickerUrl}" class="sticker" style="max-width:128px">`;
            break;
    }

    if (message.replyTo) {
        contentHtml = `<div class="reply-preview">↩️ Reply to ...</div>${contentHtml}`;
    }

    const reactionsHtml = Object.entries(message.reactions || {}).map(([emoji, users]) => {
        const isActive = users.includes(currentUserId);
        return `<button class="reaction ${isActive ? 'active' : ''}" data-emoji="${emoji}">${emoji} ${users.length}</button>`;
    }).join('');

    messageDiv.innerHTML = `
        ${contentHtml}
        <div class="message-meta">
            <span class="time">${time}</span>
            ${message.edited ? '<span class="edited">(edited)</span>' : ''}
        </div>
        <div class="reactions">${reactionsHtml}</div>
    `;

    // обработчики
    const playBtn = messageDiv.querySelector('.voice-play-btn');
    if (playBtn) playBtn.onclick = () => playVoiceMessage(playBtn.dataset.url);
    
    messageDiv.querySelectorAll('.reaction').forEach(btn => {
        btn.onclick = () => addReaction(chatId, message.id, currentUserId, btn.dataset.emoji);
    });

    return messageDiv;
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}