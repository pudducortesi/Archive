/* ============================================
   B.A. Film Festival — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Header scroll effect ---
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // --- Mobile menu ---
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');

    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', () => {
            burgerBtn.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                burgerBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Countdown timer ---
    const festivalDate = new Date('2026-03-15T09:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = festivalDate - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');

            if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // --- Editions Slider ---
    const track = document.getElementById('editionsTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');

    if (track && prevBtn && nextBtn) {
        let currentSlide = 0;
        const slides = track.querySelectorAll('.editions__slide');
        const totalSlides = slides.length;

        function getVisibleSlides() {
            const width = window.innerWidth;
            if (width <= 768) return 1;
            if (width <= 1024) return 2;
            return 3;
        }

        function updateSlider() {
            const visibleSlides = getVisibleSlides();
            const maxSlide = Math.max(0, totalSlides - visibleSlides);
            currentSlide = Math.min(currentSlide, maxSlide);

            const slideWidth = slides[0].offsetWidth;
            const gap = 24; // 1.5rem
            const offset = currentSlide * (slideWidth + gap);
            track.style.transform = `translateX(-${offset}px)`;
        }

        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlider();
            }
        });

        nextBtn.addEventListener('click', () => {
            const visibleSlides = getVisibleSlides();
            const maxSlide = Math.max(0, totalSlides - visibleSlides);
            if (currentSlide < maxSlide) {
                currentSlide++;
                updateSlider();
            }
        });

        // Touch/drag support for slider
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;

        track.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX;
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const diff = e.pageX - startX;
            if (Math.abs(diff) > 60) {
                if (diff > 0 && currentSlide > 0) {
                    currentSlide--;
                    updateSlider();
                } else if (diff < 0) {
                    const visibleSlides = getVisibleSlides();
                    const maxSlide = Math.max(0, totalSlides - visibleSlides);
                    if (currentSlide < maxSlide) {
                        currentSlide++;
                        updateSlider();
                    }
                }
                isDragging = false;
            }
        });

        track.addEventListener('mouseup', () => { isDragging = false; });
        track.addEventListener('mouseleave', () => { isDragging = false; });

        // Touch events
        track.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX;
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const diff = e.touches[0].pageX - startX;
            if (Math.abs(diff) > 60) {
                if (diff > 0 && currentSlide > 0) {
                    currentSlide--;
                    updateSlider();
                } else if (diff < 0) {
                    const visibleSlides = getVisibleSlides();
                    const maxSlide = Math.max(0, totalSlides - visibleSlides);
                    if (currentSlide < maxSlide) {
                        currentSlide++;
                        updateSlider();
                    }
                }
                isDragging = false;
            }
        }, { passive: true });

        track.addEventListener('touchend', () => { isDragging = false; });

        window.addEventListener('resize', updateSlider);
    }

    // --- Scroll animations (Intersection Observer) ---
    const fadeElements = document.querySelectorAll('.featured__main, .featured__card, .program__card, .info__card, .countdown__container, .newsletter__container');

    fadeElements.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach((el, i) => {
        const delayClass = `fade-in-delay-${(i % 4) + 1}`;
        el.classList.add(delayClass);
        observer.observe(el);
    });

});
