import { showIntroLightbox } from './components/IntroLightbox.js';
import { renderSelectScreen } from './components/SelectScreen.js';
import { renderChatScreen } from './components/ChatScreen.js';

const app = document.getElementById('app');

let idleTimer = null;

function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    showIntroLightbox();
    goToSelect();
  }, 5 * 60 * 1000);
}

function goToSelect() {
  renderSelectScreen(app, { onSelectLawyer: goToChat, onLangChange: goToSelect });
  resetIdleTimer();
}

function goToChat(lawyer) {
  renderChatScreen(app, lawyer, { onSwitchLawyer: goToSelect });
  resetIdleTimer();
}

['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
  document.addEventListener(evt, resetIdleTimer, { passive: true });
});

// Start
goToSelect();
showIntroLightbox();
resetIdleTimer();
