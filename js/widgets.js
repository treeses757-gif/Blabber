export async function installPWA() {
    if ('BeforeInstallPromptEvent' in window) {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            const deferredPrompt = e;
            // показать кнопку "Установить приложение"
            document.getElementById('installBtn').style.display = 'block';
            document.getElementById('installBtn').onclick = async () => {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
            };
        });
    }
}