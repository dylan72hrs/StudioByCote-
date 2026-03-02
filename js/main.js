/**
 * ============================================
 * MAIN.JS — Index page logic only
 * Studio By Cote
 * ============================================
 * Handles: Hero particles, Morph canvas, Parallax,
 *          Swiper carousel, Collage parallax, Mobile menu.
 * NO modals. NO reservation logic. Those live in reservation.js.
 * Depends on: services.js (loaded before this)
 */

// --- SECURITY: FORCE HTTPS ---
if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    window.location.href = window.location.href.replace('http:', 'https:');
}

window.addEventListener('load', () => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 768;

    // =============================================
    // 1) HERO PARTICLES (particles.js)
    // =============================================
    if (document.getElementById('particles-js') && typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: isMobile || isReducedMotion ? 20 : 60, density: { enable: true, value_area: 800 } },
                color: { value: ["#DEA3D4", "#9D1C8F", "#ffffff"] },
                shape: { type: "circle" },
                opacity: { value: 0.4, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
                size: { value: 3, random: true, anim: { enable: false } },
                line_linked: { enable: true, distance: 150, color: "#9D1C8F", opacity: 0.2, width: 1 },
                move: { enable: !isReducedMotion, speed: 1.5, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: !isMobile && !isReducedMotion, mode: "grab" }, onclick: { enable: false }, resize: true },
                modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } } }
            },
            retina_detect: true
        });
    }

    // =============================================
    // 1.5) HERO MORPH ANIMATION (Canvas 2D blobs)
    // =============================================
    if (!isMobile && !isReducedMotion) {
        initHeroMorph();
    }

    function initHeroMorph() {
        const canvas = document.getElementById('hero-morph');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId = null;
        let mouseX = 0.5, mouseY = 0.5;

        const palette = [
            { r: 157, g: 28, b: 143 },
            { r: 100, g: 26, b: 99 },
            { r: 222, g: 163, b: 212 },
            { r: 120, g: 40, b: 160 },
            { r: 180, g: 60, b: 140 },
            { r: 80, g: 20, b: 100 },
        ];

        const blobs = [];
        for (let i = 0; i < 6; i++) {
            blobs.push({
                cx: 0.2 + Math.random() * 0.6,
                cy: 0.2 + Math.random() * 0.6,
                orbitX: 0.08 + Math.random() * 0.15,
                orbitY: 0.06 + Math.random() * 0.12,
                size: 0.18 + Math.random() * 0.22,
                speedX: 0.2 + Math.random() * 0.4,
                speedY: 0.15 + Math.random() * 0.35,
                phaseX: Math.random() * Math.PI * 2,
                phaseY: Math.random() * Math.PI * 2,
                color: palette[i % palette.length],
                alpha: 0.25 + Math.random() * 0.2,
            });
        }

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resize();

        let resizeTimer;
        window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); });

        const heroEl = document.getElementById('home');
        if (heroEl) {
            heroEl.addEventListener('mousemove', (e) => { mouseX = e.clientX / window.innerWidth; mouseY = e.clientY / window.innerHeight; }, { passive: true });
            heroEl.addEventListener('mouseleave', () => { mouseX = 0.5; mouseY = 0.5; });
        }

        let smX = 0.5, smY = 0.5;

        function animate(time) {
            const t = time * 0.001;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = canvas.width / dpr;
            const h = canvas.height / dpr;
            const minDim = Math.min(w, h);

            smX += (mouseX - smX) * 0.03;
            smY += (mouseY - smY) * 0.03;
            const mOx = (smX - 0.5) * 0.08;
            const mOy = (smY - 0.5) * 0.08;

            ctx.clearRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'lighter';

            for (let i = 0; i < blobs.length; i++) {
                const b = blobs[i];
                const x = (b.cx + Math.sin(t * b.speedX + b.phaseX) * b.orbitX + mOx) * w;
                const y = (b.cy + Math.cos(t * b.speedY + b.phaseY) * b.orbitY + mOy) * h;
                const r = b.size * minDim * (1 + Math.sin(t * 0.8 + i) * 0.08);

                const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
                grad.addColorStop(0, 'rgba(' + b.color.r + ',' + b.color.g + ',' + b.color.b + ',' + (b.alpha * 0.9) + ')');
                grad.addColorStop(0.4, 'rgba(' + b.color.r + ',' + b.color.g + ',' + b.color.b + ',' + (b.alpha * 0.4) + ')');
                grad.addColorStop(1, 'rgba(' + b.color.r + ',' + b.color.g + ',' + b.color.b + ',0)');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalCompositeOperation = 'source-over';
            animId = requestAnimationFrame(animate);
        }

        animId = requestAnimationFrame(animate);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) { cancelAnimationFrame(animId); animId = null; }
            else if (!animId) { animId = requestAnimationFrame(animate); }
        });
    }

    // =============================================
    // 2) HERO PARALLAX (GSAP)
    // =============================================
    if (!isReducedMotion && typeof gsap !== 'undefined') {
        const heroSection = document.getElementById('home');
        const giantText = document.getElementById('hero-giant');
        const heroContent = document.getElementById('hero-content');

        if (heroSection && giantText && heroContent) {
            heroSection.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5);
                const y = (e.clientY / window.innerHeight - 0.5);
                gsap.to(giantText, { x: x * -40, y: y * -40, duration: 1, ease: "power2.out" });
                gsap.to(heroContent, { x: x * 15, y: y * 15, duration: 1, ease: "power2.out" });
            });
            heroSection.addEventListener('mouseleave', () => {
                gsap.to([giantText, heroContent], { x: 0, y: 0, duration: 1, ease: "power2.out" });
            });
        }

        // Collage Parallax
        const collageItems = document.querySelectorAll('.cb-item');
        if (collageItems.length > 0 && !isMobile) {
            let ticking = false;
            const updateParallax = () => {
                const wh = window.innerHeight;
                collageItems.forEach((item, i) => {
                    const rect = item.getBoundingClientRect();
                    if (rect.top < wh && rect.bottom > 0) {
                        const dist = (wh / 2) - (rect.top + rect.height / 2);
                        gsap.to(item.querySelector('.cb-inner'), { y: dist * (i % 2 === 0 ? 0.05 : -0.04), duration: 0.5, ease: "power1.out", overwrite: "auto" });
                    }
                });
                ticking = false;
            };
            window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; } }, { passive: true });
            updateParallax();
        }
    }

    // =============================================
    // 3) SWIPER PRODUCT GALLERY
    // =============================================
    if (typeof Swiper !== 'undefined') {
        const slideIndicator = document.getElementById('slide-indicator');

        const swiper = new Swiper('.product-swiper', {
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: "auto",
            initialSlide: 0,
            preventClicks: false,
            preventClicksPropagation: false,
            touchStartPreventDefault: false,
            coverflowEffect: { rotate: 5, stretch: 0, depth: 100, modifier: 2, slideShadows: false },
            keyboard: { enabled: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            pagination: { el: '.swiper-pagination', clickable: true },
            on: {
                init: function () { updateUI(this); },
                slideChange: function () { updateUI(this); }
            }
        });

        function updateUI(sw) {
            if (slideIndicator) {
                slideIndicator.innerHTML = (sw.activeIndex + 1).toString().padStart(2, '0') + ' / ' + sw.slides.length.toString().padStart(2, '0');
            }
            const active = sw.slides[sw.activeIndex];
            if (active) active.style.setProperty('--slide-glow', active.getAttribute('data-glow') || 'rgba(157,28,143,0.4)');
        }

        // 3D tilt on hover (desktop)
        if (!isReducedMotion && typeof gsap !== 'undefined') {
            document.querySelectorAll('.product-card').forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const r = card.getBoundingClientRect();
                    gsap.to(card, { rotateX: -((e.clientY - r.top - r.height / 2) / r.height) * 12, rotateY: ((e.clientX - r.left - r.width / 2) / r.width) * 12, scale: 1.02, duration: 0.4, ease: "power2.out" });
                });
                card.addEventListener('mouseleave', () => {
                    gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.6, ease: "power2.out" });
                });
            });
        }
    }

    // =============================================
    // 4) MOBILE MENU
    // =============================================
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }
});

// === Opiniones: loop + glitter (solo esta sección) ===
(function () {
    const track = document.getElementById('marqueeTrack');
    const wrap = track?.closest('.marquee-wrap');
    const layer = document.getElementById('glitterLayer');
    if (!track || !wrap || !layer) return;

    // Duplicar contenido para loop perfecto (sin saltos)
    // (Solo si no está duplicado aún)
    if (!track.dataset.duplicated) {
        track.innerHTML = track.innerHTML + track.innerHTML;
        track.dataset.duplicated = "1";
    }

    // Glitter control (limitador simple)
    let last = 0;
    wrap.addEventListener('mousemove', (e) => {
        const now = performance.now();
        if (now - last < 28) return; // limita partículas
        last = now;

        const rect = wrap.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dot = document.createElement('div');
        dot.className = 'glitter-dot';
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        layer.appendChild(dot);

        setTimeout(() => dot.remove(), 700);
    }, { passive: true });
})();
