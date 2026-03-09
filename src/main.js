import { lawyers } from './lawyers.js';
import { sendMessage } from './chat.js';

const app = document.getElementById('app');

let currentLawyer = null;
let chatHistory = [];
let isLoading = false;

function renderSelectScreen() {
  currentLawyer = null;
  chatHistory = [];

  app.innerHTML = `
    <div class="select-screen">
      <h1>Prima Facie</h1>
      <p class="subtitle">選擇一位律師開始諮詢</p>
      <div class="lawyers-grid">
        ${lawyers.map(l => `
          <div class="lawyer-card" data-id="${l.id}">
            <div class="name">${l.name}</div>
            <div class="role">${l.role}</div>
            <div class="desc">${l.desc}</div>
          </div>
        `).join('')}
      </div>
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

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = '44px';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
