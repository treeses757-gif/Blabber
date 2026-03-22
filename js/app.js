import { onAuthState } from './auth.js';
import { loadTheme } from './settings.js';
import { initUI } from './chat-ui.js';
import { loadContacts } from './contacts.js';
import { initCalls } from './calls.js';
import { initStories } from './stories.js';
import { setupNotifications } from './notifications.js';
import { installPWA } from './widgets.js';
import { initBotListener } from './bots.js';

let currentUser = null;

onAuthState(async (user) => {
    currentUser = user;
    if (user) {
        await loadContacts();
        initUI(user);
        initCalls(user);
        initStories(user);
        setupNotifications(user);
        installPWA();
        initBotListener(); // слушаем команды ботов
    } else {
        // Показываем форму входа
        document.getElementById('app').innerHTML = '<div class="login-container"></div>';
        import('./auth.js').then(({ showLogin }) => showLogin());
    }
});

loadTheme();