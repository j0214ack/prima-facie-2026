export function showIntroLightbox() {
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
}
