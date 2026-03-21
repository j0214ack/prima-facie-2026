import { lawyers } from '../lawyers.js';
import { showLawyerLightbox } from './LawyerLightbox.js';
import { t, tLawyer, toggleLang } from '../i18n.js';

export function renderSelectScreen(app, { onSelectLawyer, onLangChange }) {
  app.innerHTML = `
    <div class="landing-page">
      <header class="site-header">
        <span class="site-logo"><img src="/assets/chat-header-icon.svg" width="42" height="42" alt="" />${t('siteName')}</span>
        <a href="#" class="site-nav-link">${t('langToggle')}</a>
      </header>

      <section class="hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <h1 class="hero-title">${t('heroTitle')}</h1>
          <div class="hero-body">
          ${t('heroBody')}
          </div>
        </div>
      </section>

      <section class="lawyer-section">
        <div class="lawyers-grid">
          ${lawyers.map(l => `
            <div class="lawyer-card" data-id="${l.id}">
              <div class="lawyer-card-image">
                <img src="${l.image}" alt="${tLawyer(l, 'name')}" loading="lazy" />
              </div>
              <div class="lawyer-card-info">
                <div class="lawyer-card-name">${tLawyer(l, 'name')}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <footer class="site-footer">
        <p>${t('footerDisclaimer')}</p>
        <p class="site-footer-credits">${t('footerCredits')}</p>
      </footer>
    </div>
  `;

  app.querySelector('.site-nav-link').addEventListener('click', (e) => {
    e.preventDefault();
    toggleLang();
    onLangChange();
  });

  app.querySelectorAll('.lawyer-card').forEach(card => {
    card.addEventListener('click', () => {
      const lawyer = lawyers.find(l => l.id === card.dataset.id);
      if (lawyer) showLawyerLightbox(lawyer, { onStart: onSelectLawyer });
    });
  });
}
