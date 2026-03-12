import { lawyers } from './lawyers.js';
import { sendMessage, getProvider, setProvider } from './chat.js';

const app = document.getElementById('app');

let currentLawyer = null;
let chatHistory = [];
let isLoading = false;

function renderSelectScreen() {
  currentLawyer = null;
  chatHistory = [];

  app.innerHTML = `
    <div class="landing-page">
      <header class="site-header">
        <span class="site-logo">Prima Facie</span>
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
        <div class="lawyer-section-header">
          <h2 class="lawyer-section-title">在開始對話前，選擇你的律師</h2>
          <p class="lawyer-section-subtitle">每位律師有不同的專長與風格，選擇最適合你情境的一位。</p>
        </div>
        <div class="lawyers-grid">
          ${lawyers.map(l => `
            <div class="lawyer-card" data-id="${l.id}">
              <div class="lawyer-card-image">
                <img src="${l.image}" alt="${l.name}" loading="lazy" />
              </div>
              <div class="lawyer-card-info">
                <div class="lawyer-card-name">${l.name}</div>
                <div class="lawyer-card-role">${l.role}</div>
                <div class="lawyer-card-desc">${l.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <footer class="site-footer">
        <p>Prima Facie — 由 AI 驅動的模擬法律諮詢體驗。本服務不構成法律建議。</p>
      </footer>
    </div>
  `;

  app.querySelectorAll('.lawyer-card').forEach(card => {
    card.addEventListener('click', () => {
      const lawyer = lawyers.find(l => l.id === card.dataset.id);
      if (lawyer) renderChatScreen(lawyer);
    });
  });
}

function renderChatScreen(lawyer) {
  currentLawyer = lawyer;
  chatHistory = [];

  app.innerHTML = `
    <div class="chat-screen">
      <div class="chat-header">
        <button class="back-btn">← 返回</button>
        <div class="lawyer-info">
          <div class="name">${lawyer.name}</div>
          <div class="role">${lawyer.role}</div>
        </div>
      </div>
      <div class="chat-messages" id="messages">
        <div class="message ai">您好，我是${lawyer.name}，${lawyer.role}。請問有什麼我能幫您的？</div>
      </div>
      <div class="chat-input-area">
        <textarea id="chat-input" placeholder="輸入您的問題..." rows="1"></textarea>
        <button id="send-btn">送出</button>
      </div>
    </div>
  `;

  const backBtn = app.querySelector('.back-btn');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const messages = document.getElementById('messages');

  backBtn.addEventListener('click', renderSelectScreen);

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

    isLoading = true;
    sendBtn.disabled = true;
    input.value = '';
    input.style.height = '44px';

    // Add user message
    appendMessage('user', text);
    chatHistory.push({ role: 'user', text });

    // Show typing indicator
    const typingEl = appendMessage('ai typing', '正在思考中...');

    try {
      const reply = await sendMessage(
        currentLawyer.systemPrompt,
        chatHistory.slice(0, -1), // exclude current msg, it's passed separately
        text
      );
      typingEl.remove();
      appendMessage('ai', reply);
      chatHistory.push({ role: 'ai', text: reply });
    } catch (err) {
      typingEl.remove();
      appendMessage('ai', `發生錯誤：${err.message}`);
    }

    isLoading = false;
    sendBtn.disabled = false;
    input.focus();
  }

  function appendMessage(cls, text) {
    const div = document.createElement('div');
    div.className = `message ${cls}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }
}

// Start
renderSelectScreen();
