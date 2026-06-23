/* ==========================================
   MINIMAL JAVASCRIPT — no fancy animations
   ========================================== */

// ==========================================
// TYPING ANIMATION (kept — static text cycling)
// ==========================================
class TypingAnimation {
    constructor(element, phrases) {
        this.element = element;
        this.phrases = phrases;
        this.phraseIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const currentPhrase = this.phrases[this.phraseIndex];

        if (this.isDeleting) {
            this.element.textContent = currentPhrase.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentPhrase.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let speed = this.isDeleting ? 40 : 80;

        if (!this.isDeleting && this.charIndex === currentPhrase.length) {
            speed = 2500;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
            speed = 400;
        }

        setTimeout(() => this.type(), speed);
    }
}

// ==========================================
// COUNTER ANIMATION (simple count-up)
// ==========================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    counters.forEach(counter => {
        if (counter.dataset.animated) return;
        counter.dataset.animated = 'true';

        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 1500;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(target * eased);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
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

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
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
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ==========================================
// INITIALIZE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Typing animation (subtle, not flashy)
    const typingEl = document.getElementById('typingText');
    if (typingEl) {
        new TypingAnimation(typingEl, [
            'cloud infrastructure.',
            'CI/CD pipelines.',
            'Kubernetes clusters.',
            'DevOps automation.',
            'secure architectures.',
        ]);
    }

    initNavbar();
    initScrollTop();
    initSmoothScroll();

    // Animate counters on load
    animateCounters();
});
