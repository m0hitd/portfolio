// ==========================================
// HERO — Spotlight / Mask Reveal
// ==========================================
function initHeroReveal() {
    const heroImages = document.getElementById('heroImages');
    const revealLayer = document.getElementById('heroReveal');
    const skeleton = document.getElementById('heroSkeleton');

    if (!revealLayer || !heroImages) return;

    // --- Image preloader ---
    const baseImg = document.getElementById('heroBaseImg');
    const flameImg = document.getElementById('heroFlameImg');
    let loaded = 0;

    function onImageLoaded() {
        loaded++;
        if (loaded >= 2) {
            skeleton.classList.add('loaded');
            heroImages.style.opacity = '1';
        }
    }

    [baseImg, flameImg].forEach(img => {
        if (img.complete) {
            onImageLoaded();
        } else {
            img.addEventListener('load', onImageLoaded);
            img.addEventListener('error', onImageLoaded);
        }
    });

    // --- Smooth cursor tracking ---
    let mouseX = 0.5;
    let mouseY = 0.5;
    let smoothX = 0.5;
    let smoothY = 0.5;
    let rafId = null;

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function updatePosition() {
        smoothX = lerp(smoothX, mouseX, 0.32);
        smoothY = lerp(smoothY, mouseY, 0.32);

        const xPercent = (smoothX * 100).toFixed(2) + '%';
        const yPercent = (smoothY * 100).toFixed(2) + '%';

        revealLayer.style.setProperty('--x', xPercent);
        revealLayer.style.setProperty('--y', yPercent);

        rafId = requestAnimationFrame(updatePosition);
    }

    // Start animation loop
    rafId = requestAnimationFrame(updatePosition);

    // Mouse events
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
    });

    // Touch events (passive for performance)
    function handleTouch(e) {
        const touch = e.touches[0];
        if (touch) {
            mouseX = touch.clientX / window.innerWidth;
            mouseY = touch.clientY / window.innerHeight;
        }
    }

    document.addEventListener('touchmove', handleTouch, { passive: true });
    document.addEventListener('touchstart', handleTouch, { passive: true });
}

// ==========================================
// HERO — Word-by-Word Reveal Animation
// ==========================================
function initWordReveal() {
    const heading = document.getElementById('heroTitle');
    if (!heading) return;

    const text = heading.textContent.trim();
    const words = text.split(/\s+/);

    heading.textContent = '';

    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.classList.add('word-reveal');
        span.textContent = word;
        span.style.animationDelay = (index * 0.05) + 's';
        heading.appendChild(span);

        // Add space after each word (except last)
        if (index < words.length - 1) {
            heading.appendChild(document.createTextNode('\u00A0'));
        }
    });
}

// ==========================================
// NAVBAR
// ==========================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    if (!navbar) return;

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
    }

    // Close nav on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle) navToggle.classList.remove('active');
            if (navLinks) navLinks.classList.remove('open');
        });
    });

    // Close nav on click outside
    document.addEventListener('click', (e) => {
        if (navbar && !navbar.contains(e.target)) {
            if (navToggle) navToggle.classList.remove('active');
            if (navLinks) navLinks.classList.remove('open');
        }
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ==========================================
// SCROLL TO TOP
// ==========================================
function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 500);
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

// ==========================================
// FEATURED PROJECTS — View More / Less
// ==========================================
function initProjectsToggle() {
    const btn = document.getElementById('viewMoreBtn');
    const hiddenCards = document.querySelectorAll('.project-hidden');
    const projectsSection = document.getElementById('projects');

    if (!btn || hiddenCards.length === 0) return;

    let expanded = false;

    btn.addEventListener('click', () => {
        expanded = !expanded;

        if (expanded) {
            hiddenCards.forEach((card, i) => {
                card.classList.add('project-visible');
                card.style.animationDelay = (i * 0.15) + 's';
            });
            btn.classList.add('expanded');
            btn.querySelector('.view-more-text').textContent = 'View Less';
        } else {
            hiddenCards.forEach(card => {
                card.classList.remove('project-visible');
            });
            btn.classList.remove('expanded');
            btn.querySelector('.view-more-text').textContent = 'View More';

            // Smooth scroll back to projects section
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
}

// ==========================================
// CTA — Parallax Background
// ==========================================
function initCtaParallax() {
    const ctaBg = document.getElementById('ctaBg');
    const ctaSection = document.getElementById('cta');

    if (!ctaBg || !ctaSection) return;

    const bgImg = ctaBg.querySelector('img');
    if (!bgImg) return;

    function updateParallax() {
        const rect = ctaSection.getBoundingClientRect();
        const windowH = window.innerHeight;

        // Only update when section is in view
        if (rect.bottom > 0 && rect.top < windowH) {
            const progress = (windowH - rect.top) / (windowH + rect.height);
            const offset = (progress - 0.5) * 100; // -50 to +50
            bgImg.style.transform = `translateY(${offset}px)`;
        }

        requestAnimationFrame(updateParallax);
    }

    requestAnimationFrame(updateParallax);
}

// ==========================================
// CTA — MagicCard Mouse-Tracking Glow
// ==========================================
function initMagicCard() {
    const card = document.getElementById('magicCard');
    const glow = document.getElementById('magicCardGlow');

    if (!card || !glow) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        glow.style.background = `radial-gradient(
            circle 250px at ${x}px ${y}px,
            rgba(0, 212, 255, 0.12) 0%,
            rgba(124, 58, 237, 0.06) 40%,
            transparent 70%
        )`;
    });

    card.addEventListener('mouseleave', () => {
        glow.style.background = '';
    });
}

// ==========================================
// INITIALIZE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initHeroReveal();
    initWordReveal();
    initNavbar();
    initScrollTop();
    initSmoothScroll();
    initProjectsToggle();
    initCtaParallax();
    initMagicCard();
});
