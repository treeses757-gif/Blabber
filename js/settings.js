export function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.remove('light-theme');
    } else {
        document.body.classList.add('light-theme');
    }
    localStorage.setItem('theme', theme);
}

export function loadTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) setTheme(saved);
}