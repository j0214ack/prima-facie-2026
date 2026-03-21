import { lawyers } from '../lawyers.js';
import { showLawyerLightbox } from './LawyerLightbox.js';

export function renderSelectScreen(app, { onSelectLawyer }) {
  app.innerHTML = `
    <div class="landing-page">
      <header class="site-header">
        <span class="site-logo"><img src="/assets/chat-header-icon.svg" width="42" height="42" alt="" />律師辦公室裡的告解</span>
        <a href="#" class="site-nav-link">繁體中文 / EN</a>
      </header>

      <section class="hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <h1 class="hero-title">在性暴力的第一線，會看見什麼？</h1>
          <div class="hero-body">
          <p>
          在法庭，他們是代理人，將創傷「切割」成證據。<br/>
          在法袍下，他們是人，在制度與倫理的縫隙中掙扎。
          </p>
          <p>
          當法律無法解釋痛苦，當制度遺留了盲點，律師該如何消化那份沉重的情緒勞動？<br/>
          這裡整合了觀點迥異的法律靈魂的觀點，現在，歡迎選擇你的辯護人，開始你的詰問。
          </p>
          </div>
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
        <p>本系統對話內容由 AI 生成，語料來自真實律師訪談節錄。本展覽旨在提供社會思辨與對話空間，內容不構成任何法律諮詢與建議。若展覽內容觸動了您的創傷經驗，請優先照顧自己的情緒，並尋求專業心理師的陪伴。</p>
        <p class="site-footer-credits">計畫主持 ｜ 李紫彤&emsp;主辦單位 ｜ 財團法人民間司法改革基金會・微米宇宙演藝團體<br/>聯絡信箱 ｜ l.tzutung@gmail.com&emsp;© 2026 版權所有</p>
      </footer>
    </div>
  `;

  app.querySelectorAll('.lawyer-card').forEach(card => {
    card.addEventListener('click', () => {
      const lawyer = lawyers.find(l => l.id === card.dataset.id);
      if (lawyer) showLawyerLightbox(lawyer, { onStart: onSelectLawyer });
    });
  });
}
