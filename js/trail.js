(function () {

    const CONFIG = {
        starColor: '255, 220, 100',
        starRadius: 3,
        starSpacing: 20,
        glowSize: 4,
        clusterRadius: 28,
        clusterCount: 7,
        twinkleSpeed: 0.8,
        waveAmplitude: 80,
        waveFrequency: 0.6,
        sideOffset: 60,
    };

    let canvas, ctx;
    let targets = [];
    let pathPoints = [];
    let clusters = [];
    let totalPathLength = 0;
    let scrollProgress = 0;
    let headIdx = 0;
    let displayTailIdx = 0;
    let isScrolling = false;
    let scrollStopTimer = null;

    const TARGET_SELECTORS = [
        'header.masthead',
        '#Platformer h2',
        '#Platformer img',
        '#Platformer a[href*="itch.io"]',
        '#SpaceJam h2',
        '#SpaceJam a[href*="itch.io"]',
        '#Robot h2',
        '#Robot img',
        '#TowerDefense h2',
        '#TowerDefense img',
        '#Other h2',
        '#Other .portfolio-item:nth-child(1)',
        '#Other .portfolio-item:nth-child(2)',
        '#Other .portfolio-item:nth-child(3)',
        '#Other .portfolio-item:nth-child(4)',
    ];

    function init() {
        canvas = document.createElement('canvas');
        canvas.id = 'trail-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
        `;
        updateBlendMode();
        document.body.addEventListener('themechange', updateBlendMode);
        document.body.appendChild(canvas);
        resize();

        collectTargets();
        buildPath();

        window.addEventListener('resize', () => {
            resize();
            collectTargets();
            buildPath();
        });

        window.addEventListener('scroll', onScroll, { passive: true });

        animate();
    }

    function updateBlendMode() {
        const isDay = document.body.classList.contains('theme-day');
        canvas.style.mixBlendMode = isDay ? 'normal' : 'screen';
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx = canvas.getContext('2d');
    }

    function collectTargets() {
        targets = [];
        TARGET_SELECTORS.forEach((sel) => {
            const el = document.querySelector(sel);
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const scrollY = window.scrollY || window.pageYOffset;
            targets.push({
                x: rect.left + rect.width / 2,
                y: rect.top + scrollY + rect.height / 2,
                el,
            });
        });
    }

    function buildPath() {
        if (targets.length < 2) return;

        pathPoints = [];
        clusters = [];
        totalPathLength = 0;

        const curvePoints = [];

        targets.forEach((target, i) => {
            const clusterOffset = 140;
            let clusterX = i % 2 === 0
                ? target.x - clusterOffset
                : target.x + clusterOffset;

            clusterX = Math.max(
                CONFIG.clusterRadius + 20,
                Math.min(window.innerWidth - CONFIG.clusterRadius - 20, clusterX)
            );

            const waveX = clusterX + Math.sin(i * CONFIG.waveFrequency) * (CONFIG.waveAmplitude * 0.5);

            curvePoints.push({ x: waveX, y: target.y });

            clusters.push({
                x: clusterX,
                y: target.y,
                stars: generateClusterStars(clusterX, target.y),
                pathProgress: 0,
            });
        });

        const STEPS = 800;
        for (let i = 0; i < STEPS; i++) {
            const t = i / (STEPS - 1);
            const pt = catmullRom(curvePoints, t);
            pathPoints.push(pt);

            if (i > 0) {
                const prev = pathPoints[i - 1];
                const dx = pt.x - prev.x;
                const dy = pt.y - prev.y;
                totalPathLength += Math.sqrt(dx * dx + dy * dy);
            }
        }

        clusters.forEach((cluster, i) => {
            cluster.pathProgress = i / (targets.length - 1);
        });
    }

    function catmullRom(points, t) {
        const n = points.length;
        if (n === 0) return { x: 0, y: 0 };
        if (n === 1) return points[0];

        const scaled = t * (n - 1);
        const i = Math.min(Math.floor(scaled), n - 2);
        const localT = scaled - i;

        const p0 = points[Math.max(i - 1, 0)];
        const p1 = points[i];
        const p2 = points[Math.min(i + 1, n - 1)];
        const p3 = points[Math.min(i + 2, n - 1)];

        const t2 = localT * localT;
        const t3 = t2 * localT;

        return {
            x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * localT + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
            y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * localT + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
        };
    }

    function generateClusterStars(cx, cy) {
        return Array.from({ length: CONFIG.clusterCount }, (_, i) => {
            const angle = (i / CONFIG.clusterCount) * Math.PI * 2 + Math.random() * 0.5;
            const dist = CONFIG.clusterRadius * (0.4 + Math.random() * 0.6);
            return {
                x: cx + Math.cos(angle) * dist,
                y: cy + Math.sin(angle) * dist,
                radius: CONFIG.starRadius * (0.6 + Math.random() * 0.8),
                phase: Math.random() * Math.PI * 2,
            };
        });
    }

    function onScroll() {
        const scrollY = window.scrollY || window.pageYOffset;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        scrollProgress = maxScroll > 0 ? Math.min(scrollY / maxScroll * 1.3, 1) : 0;
        headIdx = Math.floor(scrollProgress * pathPoints.length);

        isScrolling = true;

        clearTimeout(scrollStopTimer);
        scrollStopTimer = setTimeout(() => {
            isScrolling = false;
        }, 600);
    }

    function animate() {
        requestAnimationFrame(animate);
        if (!ctx || pathPoints.length === 0) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const now = Date.now() / 1000;
        const scrollY = window.scrollY || window.pageYOffset;
        const isDay = document.body.classList.contains('theme-day');

        // À l'arrêt : la queue remonte lentement vers la tête
        if (!isScrolling && displayTailIdx < headIdx) {
            const tailLength = headIdx - Math.floor(displayTailIdx);
            const speed = 0.05 + Math.min(Math.sqrt(tailLength) * 0.08, 2.5);
            displayTailIdx = Math.min(headIdx, displayTailIdx + speed);
        }

        const tailLength = headIdx - Math.floor(displayTailIdx);

        if (tailLength > 1) {
            let distAccum = 0;
            let nextStarAt = 0;
            const startI = Math.floor(displayTailIdx);

            for (let i = startI + 1; i < headIdx; i++) {
                const prev = pathPoints[i - 1];
                const curr = pathPoints[i];
                const dx = curr.x - prev.x;
                const dy = curr.y - prev.y;
                distAccum += Math.sqrt(dx * dx + dy * dy);

                if (distAccum >= nextStarAt) {
                    nextStarAt += CONFIG.starSpacing;

                    const screenX = curr.x;
                    const screenY = curr.y - scrollY;
                    if (screenY < -20 || screenY > canvas.height + 20) continue;

                    const localProgress = (i - startI) / tailLength;
                    const fadeOpacity = Math.sin(localProgress * Math.PI);
                    const opacity = fadeOpacity * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(now * CONFIG.twinkleSpeed * 3 + i * 0.1)));

                    if (opacity > 0.01) drawStar(screenX, screenY, CONFIG.starRadius, opacity, isDay);
                }
            }
        }

        // Grappes
        clusters.forEach(cluster => {
            if (cluster.pathProgress > scrollProgress + 0.05) return;
            const clusterOpacity = Math.min(1, (scrollProgress - cluster.pathProgress + 0.05) / 0.05);
            cluster.stars.forEach(star => {
                const screenY = star.y - scrollY;
                if (screenY < -20 || screenY > canvas.height + 20) return;
                const opacity = clusterOpacity * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(now * CONFIG.twinkleSpeed * 2 + star.phase)));
                drawStar(star.x, screenY, star.radius, opacity, isDay);
            });
        });
    }

    function drawStar(x, y, radius, opacity, isDay) {
        const glowColor  = isDay ? '30, 144, 255'    : CONFIG.starColor;
        const haloOpacity = isDay ? Math.min(1, opacity * 1.2) : opacity * 0.4;
        const centerColor = isDay
            ? `rgba(30, 144, 255, ${Math.min(1, opacity * 1.5)})`
            : `rgba(255, 245, 180, ${opacity})`;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * CONFIG.glowSize);
        gradient.addColorStop(0, `rgba(${glowColor}, ${haloOpacity})`);
        gradient.addColorStop(1, `rgba(${glowColor}, 0)`);

        ctx.beginPath();
        ctx.arc(x, y, radius * CONFIG.glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = centerColor;
        ctx.fill();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();