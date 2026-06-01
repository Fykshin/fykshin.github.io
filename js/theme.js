(function () {
 
    // ─── COULEURS ─────────────────────────────────────────────────────────────
    const THEMES = {
        night: {
            '--bg-primary':       '#0a0f1e',
            '--bg-secondary':     '#0d1527',
            '--bg-accent':        '#101e38',
            '--text-primary':     '#e8eaf6',
            '--text-secondary':   '#b0bec5',
            '--text-muted':       '#6b7fa3',
            '--link-color':       '#7eb8f7',
            '--btn-bg':           '#1a2a4a',
            '--btn-border':       '#2a4a7a',
            '--card-bg':          '#0d1527',
            '--card-border':      '#1a2a4a',
            '--nav-bg':           '#060c18',
            '--shadow':           '0 4px 32px rgba(0,0,0,0.6)',
        },
        day: {
            '--bg-primary':       '#dce8f5',
            '--bg-secondary':     '#c8dcee',
            '--bg-accent':        '#b8d0e8',
            '--text-primary':     '#1a2340',
            '--text-secondary':   '#2c3e6b',
            '--text-muted':       '#4a6080',
            '--link-color':       '#1a5fa8',
            '--btn-bg':           '#a8c8e8',
            '--btn-border':       '#7aaad0',
            '--card-bg':          '#d0e4f4',
            '--card-border':      '#a8c8e8',
            '--nav-bg':           '#c0d8ee',
            '--shadow':           '0 4px 32px rgba(0,60,120,0.15)',
        }
    };
    // ──────────────────────────────────────────────────────────────────────────
 
    let currentTheme = localStorage.getItem('theme') || 'night';
 
    function init() {
        injectStyles();
        createToggleButton();
        applyTheme(currentTheme, false); // false = pas de transition au chargement
    }
 
    function injectStyles() {
        const style = document.createElement('style');
        style.id = 'theme-styles';
        style.textContent = `
            /* Variables CSS globales */
            :root {
                --bg-primary: #0a0f1e;
                --bg-secondary: #0d1527;
                --bg-accent: #101e38;
                --text-primary: #e8eaf6;
                --text-secondary: #b0bec5;
                --text-muted: #6b7fa3;
                --link-color: #7eb8f7;
                --btn-bg: #1a2a4a;
                --btn-border: #2a4a7a;
                --card-bg: #0d1527;
                --card-border: #1a2a4a;
                --nav-bg: #060c18;
                --shadow: 0 4px 32px rgba(0,0,0,0.6);
                --theme-transition: 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
 
            /* Transition globale lors du changement de thème */
            body.theme-transitioning *,
            body.theme-transitioning *::before,
            body.theme-transitioning *::after {
                transition:
                    background-color var(--theme-transition),
                    color var(--theme-transition),
                    border-color var(--theme-transition),
                    box-shadow var(--theme-transition) !important;
            }
 
            /* Sections */
            .content-section.bg-light,
            .content-section.bg-primary,
            .content-section {
                background-color: var(--bg-primary) !important;
                color: var(--text-primary) !important;
            }
 
            .content-section.bg-primary {
                background-color: var(--bg-secondary) !important;
            }
 
            /* Textes */
            .content-section h2,
            .content-section h3,
            .content-section .h2,
            .content-section .h3 {
                color: var(--text-primary) !important;
            }
 
            .content-section p,
            .content-section .lead {
                color: var(--text-secondary) !important;
            }
 
            .text-secondary {
                color: var(--text-muted) !important;
            }
 
            /* Liens */
            .content-section a:not(.btn):not(.portfolio-item):not(.social-link) {
                color: var(--link-color) !important;
            }
 
            /* Navigation sidebar */
            #sidebar-wrapper {
                background-color: var(--nav-bg) !important;
            }
 
            /* Footer */
            footer {
                background-color: var(--nav-bg) !important;
                color: var(--text-muted) !important;
            }
 
            /* Portfolio items overlay */
            .portfolio-item .caption {
                background: rgba(10, 15, 30, 0.85) !important;
            }
 
            /* Bouton flottant */
            #theme-toggle {
                position: fixed;
                top: 1.5rem;
                right: 1.5rem;
                width: 52px;
                height: 52px;
                border-radius: 50%;
                border: 2px solid var(--btn-border);
                background: var(--btn-bg);
                color: var(--text-primary);
                cursor: pointer;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: var(--shadow);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                font-size: 1.3rem;
                outline: none;
            }
 
            #theme-toggle:hover {
                transform: scale(1.12) rotate(15deg);
                box-shadow: 0 0 20px rgba(126, 184, 247, 0.4);
            }
 
            #theme-toggle .icon-sun,
            #theme-toggle .icon-moon {
                position: absolute;
                transition: opacity 0.4s ease, transform 0.4s ease;
            }
 
            /* Mode nuit : montrer lune, cacher soleil */
            body.theme-night #theme-toggle .icon-sun  { opacity: 0; transform: rotate(90deg) scale(0.5); }
            body.theme-night #theme-toggle .icon-moon { opacity: 1; transform: rotate(0deg) scale(1); }
 
            /* Mode jour : montrer soleil, cacher lune */
            body.theme-day #theme-toggle .icon-sun  { opacity: 1; transform: rotate(0deg) scale(1); }
            body.theme-day #theme-toggle .icon-moon { opacity: 0; transform: rotate(-90deg) scale(0.5); }
 
            /* Ripple effect au clic */
            #theme-toggle::after {
                content: '';
                position: absolute;
                border-radius: 50%;
                width: 100%;
                height: 100%;
                background: rgba(126, 184, 247, 0.3);
                transform: scale(0);
                opacity: 0;
            }
 
            #theme-toggle.ripple::after {
                animation: ripple-anim 0.5s ease-out forwards;
            }
 
            @keyframes ripple-anim {
                to { transform: scale(2.5); opacity: 0; }
            }
 
            /* Overlay de transition plein écran */
            #theme-overlay {
                position: fixed;
                inset: 0;
                background: #0a0f1e;
                opacity: 0;
                pointer-events: none;
                z-index: 9998;
                transition: opacity 0.3s ease;
            }
 
            body.theme-day #theme-overlay {
                background: #dce8f5;
            }
        `;
        document.head.appendChild(style);
    }
 
    function createToggleButton() {
        // Overlay pour la transition
        const overlay = document.createElement('div');
        overlay.id = 'theme-overlay';
        document.body.appendChild(overlay);
 
        // Bouton
        const btn = document.createElement('button');
        btn.id = 'theme-toggle';
        btn.setAttribute('aria-label', 'Changer de thème');
        btn.innerHTML = `
            <span class="icon-sun">☀️</span>
            <span class="icon-moon">🌙</span>
        `;
        document.body.appendChild(btn);
 
        btn.addEventListener('click', () => {
            // Ripple
            btn.classList.remove('ripple');
            void btn.offsetWidth; // force reflow
            btn.classList.add('ripple');
 
            const next = currentTheme === 'night' ? 'day' : 'night';
            applyTheme(next, true);
        });
    }
 
    function applyTheme(theme, animate) {
        currentTheme = theme;
        localStorage.setItem('theme', theme);
 
        const root = document.documentElement;
        const body = document.body;
        const overlay = document.getElementById('theme-overlay');
 
        if (animate && overlay) {
            // Flash rapide pour masquer le changement brutal
            overlay.style.opacity = '0.15';
            setTimeout(() => { overlay.style.opacity = '0'; }, 300);
        }
 
        // Appliquer les variables CSS
        const vars = THEMES[theme];
        Object.entries(vars).forEach(([key, val]) => {
            root.style.setProperty(key, val);
        });
 
        // Classes sur body
        body.classList.remove('theme-night', 'theme-day');
        body.classList.add(`theme-${theme}`);
 
        if (animate) {
            body.classList.add('theme-transitioning');
            setTimeout(() => body.classList.remove('theme-transitioning'), 700);
        }
    const masthead = document.querySelector('.masthead');
    if (masthead) {
        if (theme === 'day') {
            masthead.style.backgroundImage = `url('assets/img/TON_IMAGE_JOUR.png')`;
        } else {
            masthead.style.backgroundImage = `url('assets/img/Calque_5.png'), url('assets/img/Calque_4.png')`;
        }
    }
        // Adapter le canvas d'étoiles si présent
        updateStarsForTheme(theme);
    }
 
    // Cache les étoiles du masthead en mode jour (optionnel)
    function updateStarsForTheme(theme) {
        const starsCanvas = document.getElementById('stars-canvas');
        if (!starsCanvas) return;
        starsCanvas.style.opacity = theme === 'day' ? '0.3' : '1';
        starsCanvas.style.transition = 'opacity 0.6s ease';
    }
 
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
 
})();