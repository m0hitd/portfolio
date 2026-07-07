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
// GALLERY CAROUSEL
// ==========================================
function initGallery() {
    const carousel = document.getElementById('galleryCarousel');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const dotsContainer = document.getElementById('galleryDots');
    const filters = document.querySelectorAll('.gallery-filter');
    const slides = document.querySelectorAll('.gallery-slide');

    if (!carousel) return;

    const slideWidth = 384; // 360px + 24px gap

    // Build dot indicators
    function buildDots() {
        dotsContainer.innerHTML = '';
        const visibleSlides = carousel.querySelectorAll('.gallery-slide:not(.hidden)');
        visibleSlides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('gallery-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                const targetSlide = visibleSlides[i];
                carousel.scrollTo({ left: targetSlide.offsetLeft - carousel.offsetLeft, behavior: 'smooth' });
            });
            dotsContainer.appendChild(dot);
        });
    }

    // Update active dot on scroll
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.gallery-dot');
        const visibleSlides = carousel.querySelectorAll('.gallery-slide:not(.hidden)');
        const scrollLeft = carousel.scrollLeft;

        let activeIndex = 0;
        visibleSlides.forEach((slide, i) => {
            if (slide.offsetLeft - carousel.offsetLeft <= scrollLeft + 40) {
                activeIndex = i;
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIndex);
        });
    }

    carousel.addEventListener('scroll', updateDots);

    // Arrow navigation
    prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -slideWidth, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: slideWidth, behavior: 'smooth' });
    });

    // Filters
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            slides.forEach(slide => {
                if (filter === 'all' || slide.dataset.category === filter) {
                    slide.classList.remove('hidden');
                } else {
                    slide.classList.add('hidden');
                }
            });

            // Reset scroll and rebuild dots
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
            setTimeout(buildDots, 100);
        });
    });

    buildDots();
}

// ==========================================
// LIGHTBOX
// ==========================================
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    if (!lightbox) return;

    let currentImages = [];
    let currentIndex = 0;

    function getVisibleSlides() {
        return Array.from(document.querySelectorAll('.gallery-slide:not(.hidden)'));
    }

    function openLightbox(index) {
        const visibleSlides = getVisibleSlides();
        currentImages = visibleSlides.map(slide => ({
            src: slide.querySelector('img').src,
            alt: slide.querySelector('img').alt,
            caption: slide.querySelector('.gallery-caption h4').textContent
        }));
        currentIndex = index;
        showImage();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function showImage() {
        const img = currentImages[currentIndex];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = img.caption;
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        showImage();
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        showImage();
    }

    // Click on image to open
    document.querySelectorAll('.gallery-img-wrapper').forEach((wrapper, i) => {
        wrapper.addEventListener('click', () => {
            const slide = wrapper.closest('.gallery-slide');
            const visibleSlides = getVisibleSlides();
            const idx = visibleSlides.indexOf(slide);
            if (idx !== -1) openLightbox(idx);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
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
    initGallery();
    initLightbox();

    // Animate counters on load
    animateCounters();
});
