export async function installPWA() {
    if ('BeforeInstallPromptEvent' in window) {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            const deferredPrompt = e;
            let installBtn = document.getElementById('installBtn');
            if (!installBtn) {
                installBtn = document.createElement('button');
                installBtn.id = 'installBtn';
                installBtn.textContent = 'Установить приложение';
                installBtn.style.display = 'none';
                document.body.appendChild(installBtn);
            }
            installBtn.style.display = 'block';
            installBtn.onclick = async () => {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                installBtn.style.display = 'none';
            };
        });
    }
}
