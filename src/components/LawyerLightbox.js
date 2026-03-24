import { t, tLawyer } from '../i18n.js';

export function showLawyerLightbox(lawyer, { onStart }) {
  const overlay = document.createElement('div');
  overlay.className = 'lawyer-lightbox-overlay';
  overlay.innerHTML = `
    <div class="lawyer-lightbox">
      <div class="lawyer-lightbox-header">
        <span class="lawyer-lightbox-label">${t('selectLawyer')}</span>
        <button class="lawyer-lightbox-close"><img src="/assets/close.svg" width="14" height="14" alt="${t('close')}" /></button>
      </div>
      <div class="lawyer-lightbox-content">
        <div class="lawyer-lightbox-avatar">
          <img src="${lawyer.image}" alt="${tLawyer(lawyer, 'name')}" />
        </div>
        <div class="lawyer-lightbox-details">
          <h3 class="lawyer-lightbox-role">${tLawyer(lawyer, 'roleTitle') || tLawyer(lawyer, 'role')}</h3>
          <p class="lawyer-lightbox-desc">${tLawyer(lawyer, 'longDesc') || tLawyer(lawyer, 'desc')}</p>
        </div>
      </div>
      <p class="lawyer-lightbox-quote">「${tLawyer(lawyer, 'quote') || ''}」</p>
      <p class="lawyer-lightbox-disclaimer">${t('lawyerDisclaimer')}</p>
      <button class="lawyer-lightbox-cta">${t('startChat')}</button>
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
