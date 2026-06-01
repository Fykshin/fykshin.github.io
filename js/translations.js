const translations = {
    fr: {
        pageTitle: 'Portfolio',
        navHome: 'Accueil',
        navPlatformer: 'Platformer',
        navSpaceJam: 'SpaceJam',
        navRobot: 'Robot',
        navTowerDefense: 'Tower Defense',
        navOther: 'Autres projets',
        backButton: 'Retour au Portfolio',
        digitalPaintingTitle: 'Digital Painting',
        digitalPaintingSubtitle: 'Mon projet de peinture numérique',
        threeDProjectsTitle: 'Projets 3D',
        threeDProjectsSubtitle: 'Mes projets de modélisation 3D',
        dessinsTitle: 'Dessins',
        dessinsSubtitle: 'Mes dessins',
        vectorialTitle: 'Peinture vectorielle',
        vectorialSubtitle: 'Mes créations vectorielles'
    },
    en: {
        pageTitle: 'Portfolio',
        navHome: 'Home',
        navPlatformer: 'Platformer',
        navSpaceJam: 'SpaceJam',
        navRobot: 'Robot',
        navTowerDefense: 'Tower Defense',
        navOther: 'Other Projects',
        backButton: 'Back to Portfolio',
        digitalPaintingTitle: 'Digital Painting',
        digitalPaintingSubtitle: 'My digital painting project',
        threeDProjectsTitle: '3D Projects',
        threeDProjectsSubtitle: 'My 3D modeling projects',
        dessinsTitle: 'Drawings',
        dessinsSubtitle: 'My drawings',
        vectorialTitle: 'Vectorial Painting',
        vectorialSubtitle: 'My vectorial creations'
    }
};

const initializeLanguage = () => {
    const langToggle = document.getElementById('lang-toggle-sidebar');
    const translatableItems = document.querySelectorAll('[data-lang-key]');
    const currentLang = localStorage.getItem('language') || 'fr';

    const setLanguage = (lang) => {
        localStorage.setItem('language', lang);
        document.title = translations[lang].pageTitle;
        translatableItems.forEach(item => {
            const key = item.dataset.langKey;
            const value = translations[lang][key];
            if (value) {
                item.innerHTML = value;
            }
        });
        if (langToggle) {
            langToggle.textContent = lang === 'fr' ? 'EN' : 'FR';
        }
    };

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const nextLang = localStorage.getItem('language') === 'en' ? 'fr' : 'en';
            setLanguage(nextLang);
        });
    }

    setLanguage(currentLang);

    // Notify other scripts that language was initialized/changed
    // so they can update sizes/positions (e.g. canvas trails)
    document.dispatchEvent(new Event('languageChanged'));
};

document.addEventListener('DOMContentLoaded', initializeLanguage);
