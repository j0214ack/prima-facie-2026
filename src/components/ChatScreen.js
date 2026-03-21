import { GENERAL_QUESTIONS } from '../lawyers.js';
import { sendMessage } from '../chat.js';
import { t, tLawyer, getLang, toggleLang } from '../i18n.js';

export function renderChatScreen(app, lawyer, { onSwitchLawyer }) {
  let chatHistory = [];
  let isLoading = false;

  const lang = getLang();
  const lawyerQs = lawyer.suggestedQuestions?.[lang] || lawyer.suggestedQuestions?.zh || [];
  const generalQs = GENERAL_QUESTIONS[lang] || GENERAL_QUESTIONS.zh;
  const lawyerQuestions = [...lawyerQs];
  const generalQuestions = [...generalQs];
  const usedQuestions = new Set();

  function pickQuestions(count) {
    const picked = [];
    for (let i = 0; i < lawyerQuestions.length && picked.length < count; ) {
      if (!usedQuestions.has(lawyerQuestions[i])) {
        picked.push(lawyerQuestions[i]);
        lawyerQuestions.splice(i, 1);
      } else {
        i++;
      }
    }
    for (let i = 0; i < generalQuestions.length && picked.length < count; ) {
      if (!usedQuestions.has(generalQuestions[i])) {
        picked.push(generalQuestions[i]);
        generalQuestions.splice(i, 1);
      } else {
        i++;
      }
    }
    picked.forEach(q => usedQuestions.add(q));
    return picked;
  }

  const initialQuestions = pickQuestions(3);

  app.innerHTML = `
    <div class="chat-screen">
      <header class="site-header">
        <a href="#" class="site-logo site-logo-link"><img src="/assets/chat-header-icon.svg" width="42" height="42" alt="" />${t('siteName')}</a>
        <a href="#" class="site-nav-link">${t('langToggle')}</a>
      </header>
      <div class="chat-lawyer-bar">
        <div class="chat-lawyer-info">
          <img class="chat-lawyer-avatar" src="${lawyer.image}" alt="${tLawyer(lawyer, 'name')}" />
          <span class="chat-lawyer-name">${tLawyer(lawyer, 'roleTitle') || tLawyer(lawyer, 'role')}</span>
        </div>
        <button class="chat-switch-btn">${t('switchLawyer')}</button>
      </div>
      <div class="chat-messages-wrap">
      <div class="chat-messages" id="messages">
        <div class="chat-welcome">
          <div class="chat-welcome-avatar">
            <img src="${lawyer.image}" alt="${tLawyer(lawyer, 'name')}" />
          </div>
          <p class="chat-welcome-text">${t('welcomeText')}</p>
        </div>
      </div>
      <button class="scroll-to-bottom" id="scroll-to-bottom" style="display:none;">↓</button>
      </div>
      <div class="chat-bottom">
        <div class="chat-suggestions" id="suggestions">
          ${initialQuestions.map(q => `<button class="chat-suggestion-chip">${q}</button>`).join('')}
        </div>
        <div class="chat-input-area">
          <textarea id="chat-input" placeholder="${t('inputPlaceholder')}" rows="1"></textarea>
          <button id="send-btn"><img src="/assets/send-button.svg" width="40" height="40" alt="${t('send')}" /></button>
        </div>
        <div class="chat-disclaimer"><span>${t('disclaimer')}</span></div>
      </div>
    </div>
  `;

  const logoLink = app.querySelector('.site-logo-link');
  const switchBtn = app.querySelector('.chat-switch-btn');
  const langLink = app.querySelector('.site-nav-link');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const messages = document.getElementById('messages');
  const suggestions = document.getElementById('suggestions');
  const scrollBtn = document.getElementById('scroll-to-bottom');

  // Auto-scroll management
  let autoScroll = true;
  let programmaticScroll = false;

  function scrollToBottom() {
    programmaticScroll = true;
    messages.scrollTop = messages.scrollHeight;
    requestAnimationFrame(() => { programmaticScroll = false; });
  }

  function maybeScroll() {
    if (autoScroll) scrollToBottom();
  }

  function isAtBottom() {
    return messages.scrollHeight - messages.scrollTop - messages.clientHeight < 2;
  }

  messages.addEventListener('scroll', () => {
    if (programmaticScroll) return;
    if (isAtBottom()) {
      autoScroll = true;
      scrollBtn.style.display = 'none';
    } else {
      autoScroll = false;
      scrollBtn.style.display = '';
    }
  });

  scrollBtn.addEventListener('click', () => {
    autoScroll = true;
    scrollBtn.style.display = 'none';
    scrollToBottom();
  });

  logoLink.addEventListener('click', (e) => { e.preventDefault(); onSwitchLawyer(); });
  switchBtn.addEventListener('click', onSwitchLawyer);
  langLink.addEventListener('click', (e) => {
    e.preventDefault();
    toggleLang();
    // Re-render chat screen with new language
    renderChatScreen(app, lawyer, { onSwitchLawyer });
  });

  function updateSuggestionChips(questions) {
    suggestions.innerHTML = questions
      .map(q => `<button class="chat-suggestion-chip">${q}</button>`)
      .join('');
    suggestions.style.display = '';
    suggestions.querySelectorAll('.chat-suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        input.value = chip.textContent;
        handleSend();
      });
    });
    maybeScroll();
  }

  updateSuggestionChips(initialQuestions);

  // Track IME composition state
  let isComposing = false;
  input.addEventListener('compositionstart', () => { isComposing = true; });
  input.addEventListener('compositionend', () => { isComposing = false; });

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = '44px';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing && !e.isComposing) {
      e.preventDefault();
      handleSend();
    }
  });

  sendBtn.addEventListener('click', handleSend);

  function appendMessage(cls, text) {
    const div = document.createElement('div');
    div.className = `message ${cls}`;
    div.textContent = text;
    messages.appendChild(div);
    maybeScroll();
    return div;
  }

  async function handleSend() {
    const text = input.value.trim();
    if (!text || isLoading) return;

    const welcome = app.querySelector('.chat-welcome');
    if (welcome) welcome.remove();
    suggestions.style.display = 'none';
    autoScroll = true;
    scrollBtn.style.display = 'none';
    usedQuestions.add(text);

    isLoading = true;
    sendBtn.disabled = true;
    input.disabled = true;
    input.value = '';
    input.style.height = '44px';

    appendMessage('user', text);
    chatHistory.push({ role: 'user', text });

    const streamEl = appendMessage('ai', '');
    const dotsEl = document.createElement('span');
    dotsEl.className = 'typing-dots';
    dotsEl.innerHTML = '<span></span><span></span><span></span>';
    streamEl.appendChild(dotsEl);
    maybeScroll();

    let fullReply = '';
    let displayedLen = 0;
    let streamDone = false;
    const CHAR_MIN = 35;
    const CHAR_MAX = 80;
    function rand(min, range) { return min + Math.random() * range; }
    const COMMA_PAUSE = () => rand(140, 45);
    const PERIOD_PAUSE = () => rand(290, 45);
    const NEWLINE_PAUSE = () => rand(480, 45);
    const DELIMITERS = /[,，.。、！？!?\n]/;

    function getDeliverableEnd() {
      for (let i = fullReply.length - 1; i >= displayedLen; i--) {
        if (DELIMITERS.test(fullReply[i])) return i + 1;
      }
      return -1;
    }

    let typewriterRunning = false;

    function updateStreamEl(text, showDots) {
      streamEl.textContent = text;
      if (showDots) streamEl.appendChild(dotsEl);
      maybeScroll();
    }

    function typewriterTick(targetLen, resolve) {
      if (displayedLen < targetLen) {
        displayedLen++;
        updateStreamEl(fullReply.slice(0, displayedLen), false);
        const ch = fullReply[displayedLen - 1];
        let delay = CHAR_MIN + Math.random() * (CHAR_MAX - CHAR_MIN);
        if (ch === '\n') delay = NEWLINE_PAUSE();
        else if (/[,，、]/.test(ch)) delay = COMMA_PAUSE();
        else if (/[.。；;：:！!？?…—–]/.test(ch)) delay = PERIOD_PAUSE();
        setTimeout(() => typewriterTick(targetLen, resolve), delay);
      } else {
        resolve();
      }
    }

    function typewrite(targetLen) {
      return new Promise((resolve) => typewriterTick(targetLen, resolve));
    }

    async function processBuffer() {
      if (typewriterRunning) return;
      typewriterRunning = true;

      while (true) {
        const deliverEnd = getDeliverableEnd();
        if (deliverEnd > displayedLen) {
          await typewrite(deliverEnd);
          if (!streamDone) {
            updateStreamEl(fullReply.slice(0, displayedLen), true);
          }
        } else if (streamDone) {
          if (displayedLen < fullReply.length) {
            await typewrite(fullReply.length);
          }
          break;
        } else {
          break;
        }
      }

      typewriterRunning = false;
    }

    try {
      const reply = await sendMessage(
        lawyer.id,
        chatHistory.slice(0, -1),
        text,
        (chunk) => {
          fullReply = chunk;
          processBuffer();
        }
      );
      fullReply = reply;
      streamDone = true;
      await processBuffer();
      while (typewriterRunning) {
        await new Promise(r => setTimeout(r, 50));
      }
      if (displayedLen < fullReply.length) {
        await typewrite(fullReply.length);
      }
      dotsEl.remove();
      chatHistory.push({ role: 'ai', text: reply });

      const followUps = pickQuestions(3);
      if (followUps.length > 0) {
        followUps.forEach(q => usedQuestions.add(q));
        updateSuggestionChips(followUps);
      }
    } catch (err) {
      dotsEl.remove();
      streamEl.textContent = `${t('error')}${err.message}`;
    }

    isLoading = false;
    sendBtn.disabled = false;
    input.disabled = false;
    input.focus();
  }
}
