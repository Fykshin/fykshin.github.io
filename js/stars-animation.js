/**
 * stars-animation.js
 * Détecte automatiquement les étoiles du PNG et les fait scintiller sur un canvas
 * 
 * UTILISATION : voir README en bas de fichier
 */

(function () {

    // ─── CONFIGURATION ────────────────────────────────────────────────────────
    const CONFIG = {
        starsImagePath: 'assets/img/Calque_5.png',   // chemin vers ton PNG d'étoiles
        brightnessThreshold: 50,                      // sensibilité de détection (0-255), augmenter si trop d'étoiles détectées
        samplingStep: 4,                              // analyser 1 pixel sur X (4 = rapide, 1 = précis mais lent)
        minStarRadius: 0.8,                           // taille min des étoiles canvas
        maxStarRadius: 2.5,                           // taille max des étoiles canvas
        twinkleSpeed: 0.2,                          // vitesse de scintillement (plus grand = plus rapide)
        twinkleMinOpacity: 0.1,                       // opacité minimale pendant le scintillement
        twinkleMaxOpacity: 1.0,                       // opacité maximale pendant le scintillement
        starColor: '200, 220, 255',                   // couleur RGB des étoiles canvas
        maxStars: 400,                                // nombre max d'étoiles à animer (performance)
    };
    // ──────────────────────────────────────────────────────────────────────────

    let canvas, ctx, stars = [], animationId;

    function init() {
        const masthead = document.querySelector('.masthead');
        if (!masthead) {
            console.warn('[stars-animation] Aucun élément .masthead trouvé.');
            return;
        }

        // Créer le canvas
        canvas = document.createElement('canvas');
        canvas.id = 'stars-canvas';
        canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2;
        `;

        // S'assurer que le masthead est en position relative/absolute
        const mastheadPosition = window.getComputedStyle(masthead).position;
        if (mastheadPosition === 'static') {
            masthead.style.position = 'relative';
        }

        masthead.appendChild(canvas);
        resizeCanvas();

        // Détecter les étoiles depuis le PNG
        detectStarsFromImage(CONFIG.starsImagePath, function (detectedStars) {
            stars = detectedStars;
            startAnimation();
        });

        window.addEventListener('resize', resizeCanvas);
    }

    function resizeCanvas() {
        if (!canvas) return;
        const masthead = canvas.parentElement;
        canvas.width = masthead.offsetWidth;
        canvas.height = masthead.offsetHeight;
        ctx = canvas.getContext('2d');
    }

    function detectStarsFromImage(imagePath, callback) {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = function () {
            // Canvas temporaire pour lire les pixels
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = img.width;
            tempCanvas.height = img.height;
            tempCtx.drawImage(img, 0, 0);

            let imageData;
            try {
                imageData = tempCtx.getImageData(0, 0, img.width, img.height);
            } catch (e) {
                console.warn('[stars-animation] Impossible de lire les pixels (CORS ?). Utilisation de positions aléatoires.');
                callback(generateRandomStars());
                return;
            }

            const data = imageData.data;
            const detectedPositions = [];

            // Parcourir les pixels en sautant par steps
            for (let y = 0; y < img.height; y += CONFIG.samplingStep) {
                for (let x = 0; x < img.width; x += CONFIG.samplingStep) {
                    const i = (y * img.width + x) * 4;
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const brightness = (r + g + b) / 3;

                    if (brightness > CONFIG.brightnessThreshold) {
                        detectedPositions.push({
                            xRatio: x / img.width,   // stocker en ratio pour être responsive
                            yRatio: y / img.height,
                            brightness: brightness
                        });
                    }
                }
            }

            console.log(`[stars-animation] ${detectedPositions.length} étoiles détectées.`);

            // Limiter le nombre d'étoiles et les trier par luminosité (garder les plus brillantes)
            detectedPositions.sort((a, b) => b.brightness - a.brightness);
            const selected = detectedPositions.slice(0, CONFIG.maxStars);

            // Convertir en objets étoiles animables
            const starsArray = selected.map(pos => ({
                xRatio: pos.xRatio,
                yRatio: pos.yRatio,
                radius: CONFIG.minStarRadius + (pos.brightness / 255) * (CONFIG.maxStarRadius - CONFIG.minStarRadius),
                opacity: Math.random() * (CONFIG.twinkleMaxOpacity - CONFIG.twinkleMinOpacity) + CONFIG.twinkleMinOpacity,
                phase: Math.random() * Math.PI * 2,             // phase aléatoire → scintillement désynchronisé
                speed: CONFIG.twinkleSpeed * (0.5 + Math.random()), // vitesse légèrement variable
            }));

            callback(starsArray);
        };

        img.onerror = function () {
            console.warn(`[stars-animation] Image non trouvée : ${imagePath}. Utilisation de positions aléatoires.`);
            callback(generateRandomStars());
        };

        img.src = imagePath;
    }

    // Fallback si l'image ne charge pas
    function generateRandomStars() {
        return Array.from({ length: 200 }, () => ({
            xRatio: Math.random(),
            yRatio: Math.random(),
            radius: CONFIG.minStarRadius + Math.random() * (CONFIG.maxStarRadius - CONFIG.minStarRadius),
            opacity: Math.random(),
            phase: Math.random() * Math.PI * 2,
            speed: CONFIG.twinkleSpeed * (0.5 + Math.random()),
        }));
    }

    function startAnimation() {
        if (animationId) cancelAnimationFrame(animationId);
        animate();
    }

   function animate() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = Date.now() / 1000; // secondes écoulées

    stars.forEach(star => {
        const x = star.xRatio * canvas.width;
        const y = star.yRatio * canvas.height;

        // Opacité qui oscille entre 0.1 et 1.0
        const opacity = 0.1 + 0.9 * (0.5 + 0.5 * Math.sin(now * star.speed * 6 + star.phase));
        ctx.beginPath();
        ctx.arc(x, y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${opacity})`;
        ctx.fill();
    });

    animationId = requestAnimationFrame(animate);
}
    // Lancer quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
