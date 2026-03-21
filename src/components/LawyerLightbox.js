export function showLawyerLightbox(lawyer, { onStart }) {
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

  function close() {
    overlay.remove();
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  overlay.querySelector('.lawyer-lightbox-close').addEventListener('click', close);

  overlay.querySelector('.lawyer-lightbox-cta').addEventListener('click', () => {
    close();
    onStart(lawyer);
  });
}
