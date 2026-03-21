import { t } from '../i18n.js';

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
          <h2 class="lightbox-title">${t('introTitle')}</h2>
          <div class="lightbox-text">
            ${t('introText')}
          </div>
        </div>
        <button class="lightbox-cta">${t('talkToLawyer')}</button>
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
