/*!
* Start Bootstrap - Stylish Portfolio v6.0.6 (https://startbootstrap.com/theme/stylish-portfolio)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-stylish-portfolio/blob/master/LICENSE)
*/
window.addEventListener('DOMContentLoaded', event => {

    const sidebarWrapper = document.getElementById('sidebar-wrapper');
    let scrollToTopVisible = false;
    // Closes the sidebar menu
    const menuToggle = document.body.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', event => {
        event.preventDefault();
        sidebarWrapper.classList.toggle('active');
        _toggleMenuIcon();
        menuToggle.classList.toggle('active');
    })

    // Closes responsive menu when a scroll trigger link is clicked
    var scrollTriggerList = [].slice.call(document.querySelectorAll('#sidebar-wrapper .js-scroll-trigger'));
    scrollTriggerList.map(scrollTrigger => {
        scrollTrigger.addEventListener('click', () => {
            sidebarWrapper.classList.remove('active');
            menuToggle.classList.remove('active');
            _toggleMenuIcon();
        })
    });

    function _toggleMenuIcon() {
        const menuToggleBars = document.body.querySelector('.menu-toggle > .fa-bars');
        const menuToggleTimes = document.body.querySelector('.menu-toggle > .fa-xmark');
        if (menuToggleBars) {
            menuToggleBars.classList.remove('fa-bars');
            menuToggleBars.classList.add('fa-xmark');
        }
        if (menuToggleTimes) {
            menuToggleTimes.classList.remove('fa-xmark');
            menuToggleTimes.classList.add('fa-bars');
        }
    }

    // Scroll to top button appear
    document.addEventListener('scroll', () => {
        const scrollToTop = document.body.querySelector('.scroll-to-top');
        if (document.documentElement.scrollTop > 100) {
            if (!scrollToTopVisible) {
                fadeIn(scrollToTop);
                scrollToTopVisible = true;
            }
        } else {
            if (scrollToTopVisible) {
                fadeOut(scrollToTop);
                scrollToTopVisible = false;
            }
        }
    })
    // GSAP animations (if GSAP is loaded)
    if (window.gsap) {
        if (window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
        }

        const masthead = document.querySelector('.masthead');
        const title = document.querySelector('.masthead h1');
        const subtitle = document.querySelector('.masthead h2');

        gsap.from('.masthead .container', { y: -30, opacity: 0, duration: 0.8, ease: 'power3.out' });
        gsap.from('.portfolio-item', { scale: 0.98, opacity: 0, stagger: 0.12, duration: 0.6, ease: 'power2.out', delay: 0.25 });

        if (window.ScrollTrigger) {
            gsap.utils.toArray('.content-section').forEach((section, index) => {
                const fromDirection = index % 2 === 0 ? -200 : 200;
                gsap.fromTo(section, { x: fromDirection, opacity: 0 }, {
                    x: 0,
                    opacity: 1,
                    ease: 'power3.out',
                    duration: 0.9,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        end: 'top 40%',
                        scrub: 0.3,
                    }
                });
            });

            // Animate portfolio items with stagger
            gsap.utils.toArray('#Other .portfolio-item').forEach((item, idx) => {
                gsap.fromTo(item, { x: 150 + idx * 20, opacity: 0 }, {
                    x: 0,
                    opacity: 1,
                    ease: 'power2.out',
                    duration: 0.7,
                    delay: idx * 0.1,
                    scrollTrigger: {
                        trigger: '#Other',
                        start: 'top 75%',
                        end: 'top 50%',
                        scrub: 0.2
                    }
                });
            });

            if (title) {
                gsap.to(title, {
                    y: -40,
                    scale: 0.98,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: masthead,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true,
                    }
                });
            }

            if (subtitle) {
                gsap.to(subtitle, {
                    y: -25,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: masthead,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true,
                    }
                });
            }
        }

        // Hover animations for portfolio items
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            const img = item.querySelector('img');
            const cap = item.querySelector('.caption');
            item.addEventListener('mouseenter', () => {
                gsap.to(img, { scale: 1.06, duration: 0.6, ease: 'power3.out' });
                if (cap) gsap.to(cap, { opacity: 1, duration: 0.35 });
            });
            item.addEventListener('mouseleave', () => {
                gsap.to(img, { scale: 1, duration: 0.6, ease: 'power3.out' });
                if (cap) gsap.to(cap, { opacity: 0, duration: 0.25 });
            });
        });

        // Hover + mousemove interaction on the title
        if (masthead && title) {
            masthead.addEventListener('mousemove', event => {
                const x = (event.clientX / window.innerWidth - 0.5) * 12;
                const y = (event.clientY / window.innerHeight - 0.5) * 12;
                gsap.to([title, subtitle].filter(Boolean), {
                    x,
                    y,
                    duration: 0.6,
                    ease: 'power3.out'
                });
            });
            masthead.addEventListener('mouseleave', () => {
                gsap.to([title, subtitle].filter(Boolean), {
                    x: 0,
                    y: 0,
                    duration: 0.7,
                    ease: 'power3.out'
                });
            });
        }

        // Animated letter scramble effect on section titles
        const sectionTitles = document.querySelectorAll('section h2');
        const scrambleLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%!';
        const originalTexts = new Map();

        sectionTitles.forEach(title => {
            originalTexts.set(title, title.textContent);
            title.dataset.animated = 'false';
        });

        const animateTextScramble = (element) => {
            if (element.dataset.animated === 'true') return;
            element.dataset.animated = 'true';

            const originalText = originalTexts.get(element);
            let duration = 0.5;
            let animationEnd = Date.now() + duration * 1000;

            const frameInterval = setInterval(() => {
                const remaining = Math.max(0, animationEnd - Date.now());
                const progress = 1 - remaining / (duration * 1000);

                let scrambled = '';
                for (let i = 0; i < originalText.length; i++) {
                    if (i < Math.floor(progress * originalText.length)) {
                        scrambled += originalText[i];
                    } else {
                        scrambled += scrambleLetters[Math.floor(Math.random() * scrambleLetters.length)];
                    }
                }
                element.textContent = scrambled;

                if (remaining <= 0) {
                    clearInterval(frameInterval);
                    element.textContent = originalText;
                }
            }, 30);
        };

        // Intersection Observer for letter animation
        if (sectionTitles.length) {
            const titleObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.target.dataset.animated === 'false') {
                        animateTextScramble(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            sectionTitles.forEach(title => titleObserver.observe(title));
        }

        const translations = {
            fr: {
                pageTitle: 'Portfolio',
                navHome: 'Accueil',
                navPlatformer: 'Platformer',
                navSpaceJam: 'SpaceJam',
                navRobot: 'Robot',
                navTowerDefense: 'Tower Defense',
                navOther: 'Autres projets',
                headerTitle: 'Portfolio',
                headerSubtitle: 'Bonjour!<br> Bienvenue sur mon portfolio! Je m\'appelle Guillaume Gachelin et je suis en première année de création de jeux vidéo. À ce qu\'on dit, le monde a besoin d\'être diverti alors me voici!',
                headerButton: 'En savoir plus',
                platformerTitle: 'Projet de fin d\'année : Rabbit Factory',
                platformerText: 'L\'objectif de ce projet est de concevoir seul un jeu de plateforme en 2D à défilement horizontal en trois mois. <br>Voici ce que j\'ai imaginé : Dans un laboratoire expérimental des années 2070, des chercheurs font des expériences sur des animaux. Un lapin, à la suite d’un effondrement, sort de sa cuve. Son objectif : s’échapper du labo. Pour l\'aider, il redécouvrira que ses oreilles ont des pouvoirs bien singuliers... <a href="https://fykshin.itch.io/Rabbit_Factory" style="color: black; background: none; border: none; text-decoration: underline;">itch.io</a> ! <br> Le principe de ce platformer est de débloquer de nouvelles capacités au fur et à mesure de la progression du joueur. Par exemple, le joueur pourra courir, sauter, faire des wall jumps et tourner le monde autour de lui. Pour pouvoir progresser dans le jeu, il lui faudra trouver un certain nombre de clés pour débloquer chaque salle.',
                spaceJamTitle: 'Participation à la Space Game Jam 99',
                spaceJamText: 'Thème choisi : "Communication Asymétrique". Un jeu 3D éducatif sur les différents thèmes de la Game Jam, créé par 5 étudiants de première année. À l\'aide d\'antennes, récupérez les informations des satellites en orbite pour répondre aux missions de vos clients dans le temps imparti. <a href="https://dineil.itch.io/starcom" style="color: black;">itch.io</a> !',
                robotTitle: 'Tiny Robot',
                robotText: 'Un projet de modélisation 3D où l\'objectif était de reproduire une référence aussi fidèlement que possible à partir de photographies. Sans limite de polygones et sans contrainte de texturing ou de dépliage UV, ce projet s\'est concentré sur la précision géométrique et la capture des détails du modèle original. C\'était une excellente occasion de pratiquer les techniques de modeling 3D et de composition tout en développant un œil critique pour l\'observation des formes et des proportions.',
                towerDefenseTitle: 'Tower Defense',
                towerDefenseText: 'Un projet rapide développé en mettant l\'accent sur la programmation. Ce jeu Tower Defense met en avant la gestion des vagues d\'ennemis et d\'alliés, en ayant pour but de tirer avec le bon type de balle sur les arrivants.',
                projectsTitle: 'Portfolio',
                projectsSubtitle: 'Autres projets',
                digitalPaintingTitle: 'Digital Painting',
                digitalPaintingLink: 'Voir plus !',
                threeDProjectsTitle: 'Projets 3D',
                threeDProjectsLink: 'Voir plus !',
                dessinsTitle: 'Dessins',
                dessinsLink: 'Voir plus !',
                vectorialTitle: 'Peinture vectorielle',
                vectorialLink: 'Voir plus !'
            },
            en: {
                pageTitle: 'Portfolio',
                navHome: 'Home',
                navPlatformer: 'Platformer',
                navSpaceJam: 'SpaceJam',
                navRobot: 'Robot',
                navTowerDefense: 'Tower Defense',
                navOther: 'Other Projects',
                headerTitle: 'Portfolio',
                headerSubtitle: 'Hello!<br> Welcome to my portfolio! My name is Guillaume Gachelin and I am in my first year of video game creation. As they say, the world needs entertainment so here I am!',
                headerButton: 'Learn more',
                platformerTitle: 'End-of-year project: Rabbit Factory',
                platformerText: 'The objective of this project is to design a solo 2D side-scrolling platformer in three months. <br>This is what I imagined: In an experimental laboratory of the 2070s, researchers conduct experiments on animals. A rabbit, after a collapse, escapes from its tank. Its goal: to flee the lab. To help it, it will rediscover that its ears have very special powers... <a href="https://fykshin.itch.io/Rabbit_Factory" style="color: black; background: none; border: none; text-decoration: underline;">itch.io</a> ! <br> The principle of this platformer is to unlock new abilities as the player progresses. For example, the player can run, jump, wall jump, and rotate the world around them. To advance in the game, they must find a number of keys to unlock each room.',
                spaceJamTitle: 'Participation in Space Game Jam 99',
                spaceJamText: 'Chosen theme: "Asymmetric Communication". A 3D educational game on the various themes of the Game Jam, created by 5 first-year students. Using antennas, collect information from orbiting satellites to complete missions for your clients within the allotted time. <a href="https://dineil.itch.io/starcom" style="color: black;">itch.io</a> !',
                robotTitle: 'Tiny Robot',
                robotText: 'A 3D modeling project where the goal was to reproduce a reference as faithfully as possible from photographs. With no polygon limit and no texturing or UV unwrapping constraints, this project focused on geometric precision and capturing the original model\'s details. It was a great opportunity to practice 3D modeling and composition techniques while developing a critical eye for observing shapes and proportions.',
                towerDefenseTitle: 'Tower Defense',
                towerDefenseText: 'A quick project developed with a focus on programming. This Tower Defense game emphasizes managing enemy waves and allies while shooting the right type of projectile at incoming foes.',
                projectsTitle: 'Portfolio',
                projectsSubtitle: 'Other Projects',
                digitalPaintingTitle: 'Digital Painting',
                digitalPaintingLink: 'See more!',
                threeDProjectsTitle: '3D Projects',
                threeDProjectsLink: 'See more!',
                dessinsTitle: 'Drawings',
                dessinsLink: 'See more!',
                vectorialTitle: 'Vectorial Painting',
                vectorialLink: 'See more!'
            }
        };

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
    }
})

function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= .1) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
};

function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";
    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};
