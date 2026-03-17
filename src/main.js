import { lawyers } from './lawyers.js';
import { sendMessage, getProvider, setProvider } from './chat.js';

const app = document.getElementById('app');

let currentLawyer = null;
let chatHistory = [];
let isLoading = false;
let idleTimer = null;

function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    showLightbox();
  }, 5 * 60 * 1000);
}

function showLightbox() {
  if (currentLawyer) {
    currentLawyer = null;
    chatHistory = [];
    renderSelectScreen();
  }

  const existing = document.querySelector('.lightbox-overlay');
  if (existing) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <div class="lightbox">
      <div class="lightbox-image">
        <img src="https://cdn.jsdelivr.net/gh/j0214ack/prima-facie-2026@main/public/assets/intro-lighbox-background.webp" alt="" />
      </div>
      <div class="lightbox-body">
        <div class="lightbox-text-wrap">
          <h2 class="lightbox-title">歡迎來到虛擬的<br class="mobile-br" />「律師辦公室」</h2>
          <div class="lightbox-text">
            <p>「Prima Facie」直譯為「原本以為」，在法律上則指「乍看之下即成立的證據」。</p>
            <p>然而，在權勢關係與性暴力的情境中，創傷真的能被「證據」完整呈現嗎？「原本以為」往往成為所有創傷敘事的起點：</p>
            <p>「原本以為，他是好人。」<br/>「原本以為，可法應還給我正義。」<br/>「原本以為，只要把創傷翻譯成法律代價，痛苦就會終止。」</p>
            <p>在這個 AI 對話空間中，我們整合了多位律師、觀點迥異的訪談節錄。<br/>在這裡，法律不再只是冰冷條文，而是一套交織著個人經驗、詮釋與父權盲點的系統。<br/>你可以與不同的「律師」展開對話，模擬身在性平衝突第一線的律師們的經驗與各種立場。</p>
          </div>
        </div>
        <button class="lightbox-cta">跟律師聊聊 →</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  overlay.querySelector('.lightbox-cta').addEventListener('click', () => {
    overlay.remove();
    document.body.style.overflow = '';
  });
  resetIdleTimer();
}

function showLawyerLightbox(lawyer) {
  const overlay = document.createElement('div');
  overlay.className = 'lawyer-lightbox-overlay';
  overlay.innerHTML = `
    <div class="lawyer-lightbox">
      <div class="lawyer-lightbox-header">
        <span class="lawyer-lightbox-label">選擇律師</span>
        <button class="lawyer-lightbox-close"><img src="/assets/close.svg" width="14" height="14" alt="關閉" /></button>
      </div>
      <div class="lawyer-lightbox-content">
        <div class="lawyer-lightbox-avatar">
          <img src="${lawyer.image}" alt="${lawyer.name}" />
        </div>
        <div class="lawyer-lightbox-details">
          <h3 class="lawyer-lightbox-role">${lawyer.roleTitle || lawyer.role}</h3>
          <p class="lawyer-lightbox-desc">${lawyer.longDesc || lawyer.desc}</p>
          <p class="lawyer-lightbox-quote">「${lawyer.quote || ''}」</p>
        </div>
      </div>
      <button class="lawyer-lightbox-cta">開始聊聊 →</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  function closeLawyerLightbox() {
    overlay.remove();
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLawyerLightbox();
  });

  overlay.querySelector('.lawyer-lightbox-close').addEventListener('click', closeLawyerLightbox);

  overlay.querySelector('.lawyer-lightbox-cta').addEventListener('click', () => {
    overlay.remove();
    document.body.style.overflow = '';
    renderChatScreen(lawyer);
  });
}

['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
  document.addEventListener(evt, resetIdleTimer, { passive: true });
});

function renderSelectScreen() {
  currentLawyer = null;
  chatHistory = [];

  app.innerHTML = `
    <div class="landing-page">
      <header class="site-header">
        <span class="site-logo"><img src="/assets/chat-header-icon.svg" width="42" height="42" alt="" />律師辦公室裡的告解</span>
        <a href="#" class="site-nav-link">關於本計畫</a>
      </header>

      <section class="hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <h1 class="hero-title">在性暴力的第一線，會看見什麼？</h1>
          <p class="hero-body">在法庭，他們是代理人，將創傷「切割」成證據。在法袍下，他們是人，在制度與倫理的縫隙中掙扎。當法律無法解釋痛苦，當制度遺留了盲點，律師該如何消化那份沉重的情緒勞動？</p>
          <p class="hero-cta">這裡整合了觀點迥異的法律靈魂的觀點，現在，歡迎選擇你的辯護人，開始你的詰問。</p>
        </div>
      </section>

      <section class="lawyer-section">
        <div class="lawyers-grid">
          ${lawyers.map(l => `
            <div class="lawyer-card" data-id="${l.id}">
              <div class="lawyer-card-image">
                <img src="${l.image}" alt="${l.name}" loading="lazy" />
              </div>
              <div class="lawyer-card-info">
                <div class="lawyer-card-name">${l.name}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <footer class="site-footer">
        <p>本系統對話內容由 AI 生成，語料來自真實律師訪談節錄。<br/>本展覽旨在提供社會思辨與對話空間，內容不構成任何法律諮詢與建議。<br/>若展覽內容觸動了您的創傷經驗，請優先照顧自己的情緒，並尋求專業心理師的陪伴。</p>
        <p class="site-footer-credits">計畫主持 ｜ 李紫彤&emsp;主辦單位 ｜ 財團法人民間司法改革基金會・微米宇宙演藝團體<br/>聯絡信箱 ｜ l.tzutung@gmail.com&emsp;© 2026 版權所有</p>
      </footer>
    </div>
  `;

  app.querySelectorAll('.lawyer-card').forEach(card => {
    card.addEventListener('click', () => {
      const lawyer = lawyers.find(l => l.id === card.dataset.id);
      if (lawyer) showLawyerLightbox(lawyer);
    });
  });
}

function renderChatScreen(lawyer) {
  currentLawyer = lawyer;
  chatHistory = [];

  const questionPool = [...(lawyer.suggestedQuestions || [])];
  const usedQuestions = new Set();

  function pickQuestions(count) {
    const available = questionPool.filter(q => !usedQuestions.has(q));
    const picked = [];
    for (let i = 0; i < count && available.length > 0; i++) {
      const idx = Math.floor(Math.random() * available.length);
      picked.push(available.splice(idx, 1)[0]);
    }
    return picked;
  }

  const initialQuestions = pickQuestions(3);
  initialQuestions.forEach(q => usedQuestions.add(q));

  app.innerHTML = `
    <div class="chat-screen">
      <header class="site-header">
        <span class="site-logo"><img src="/assets/chat-header-icon.svg" width="42" height="42" alt="" />律師辦公室裡的告解</span>
        <a href="#" class="site-nav-link">繁體中文 / EN</a>
      </header>
      <div class="chat-lawyer-bar">
        <div class="chat-lawyer-info">
          <img class="chat-lawyer-avatar" src="${lawyer.image}" alt="${lawyer.name}" />
          <span class="chat-lawyer-name">${lawyer.roleTitle || lawyer.role}</span>
        </div>
        <button class="chat-switch-btn">換律師聊</button>
      </div>
      <div class="chat-messages-wrap">
      <div class="chat-messages" id="messages">
        <div class="chat-welcome">
          <div class="chat-welcome-avatar">
            <img src="${lawyer.image}" alt="${lawyer.name}" />
          </div>
          <p class="chat-welcome-text">您可以選擇預設問題，或是由自己發問。<br/>與議題無關的話題將會被引導回正題。</p>
        </div>
      </div>
      <button class="scroll-to-bottom" id="scroll-to-bottom" style="display:none;">↓</button>
      </div>
      <div class="chat-bottom">
        <div class="chat-suggestions" id="suggestions">
          ${initialQuestions.map(q => `<button class="chat-suggestion-chip">${q}</button>`).join('')}
        </div>
        <div class="chat-input-area">
          <textarea id="chat-input" placeholder="請輸入你的好奇..." rows="1"></textarea>
          <button id="send-btn"><img src="/assets/send-button.svg" width="40" height="40" alt="送出" /></button>
        </div>
        <div class="chat-disclaimer"><span>這是 AI 模擬對話情境，供教育用途，不構成法律建議。</span></div>
      </div>
    </div>
  `;

  const switchBtn = app.querySelector('.chat-switch-btn');
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
    // Reset flag after browser processes the scroll event
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
    // User-initiated scroll
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

  switchBtn.addEventListener('click', renderSelectScreen);

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

  // Initial suggested question chips
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

  async function handleSend() {
    const text = input.value.trim();
    if (!text || isLoading) return;

    // Hide welcome on first message, always hide suggestions during loading
    const welcome = app.querySelector('.chat-welcome');
    if (welcome) welcome.remove();
    suggestions.style.display = 'none';
    // Re-enable auto-scroll when user sends a message
    autoScroll = true;
    scrollBtn.style.display = 'none';
    // Mark the user's text as used so it won't appear as a suggestion
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
      // Find the last delimiter in the buffered but not-yet-displayed text
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
        currentLawyer.id,
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
      // Wait for any in-flight typewriter to finish
      while (typewriterRunning) {
        await new Promise(r => setTimeout(r, 50));
      }
      // Final flush in case anything remains
      if (displayedLen < fullReply.length) {
        await typewrite(fullReply.length);
      }
      dotsEl.remove();
      chatHistory.push({ role: 'ai', text: reply });

      // Show follow-up question chips
      const followUps = pickQuestions(2);
      if (followUps.length > 0) {
        followUps.forEach(q => usedQuestions.add(q));
        updateSuggestionChips(followUps);
      }
    } catch (err) {
      dotsEl.remove();
      streamEl.textContent = `發生錯誤：${err.message}`;
    }

    isLoading = false;
    sendBtn.disabled = false;
    input.disabled = false;
    input.focus();
  }

  function appendMessage(cls, text) {
    const div = document.createElement('div');
    div.className = `message ${cls}`;
    div.textContent = text;
    messages.appendChild(div);
    maybeScroll();
    return div;
  }
}

// Start
renderSelectScreen();
showLightbox();
resetIdleTimer();
