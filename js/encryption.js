// Используем Web Crypto API для шифрования
export async function generateKey() {
    return await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

export async function encryptMessage(text, key) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(text);
    const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encoded
    );
    return { encrypted: Array.from(new Uint8Array(encrypted)), iv: Array.from(iv) };
}

export async function decryptMessage(encryptedData, key, iv) {
    const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(iv) },
        key,
        new Uint8Array(encryptedData)
    );
    return new TextDecoder().decode(decrypted);
}