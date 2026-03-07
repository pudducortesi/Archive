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
    const festivalDate = new Date('2026-03-21T09:00:00').getTime();
    let countdownInterval = null;

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = festivalDate - now;

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        } else {
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            if (countdownInterval) clearInterval(countdownInterval);
        }
    }

    if (document.getElementById('days')) {
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    }

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

            prevBtn.style.opacity = currentSlide === 0 ? '0.3' : '1';
            nextBtn.style.opacity = currentSlide >= maxSlide ? '0.3' : '1';
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
        updateSlider();
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other items
                faqItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                        const otherBtn = other.querySelector('.faq-item__question');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
                question.setAttribute('aria-expanded', !isActive);
            });
        }
    });

    // --- Program Schedule Tabs ---
    const tabButtons = document.querySelectorAll('.schedule__tab');
    const tabPanels = document.querySelectorAll('.schedule__day');

    if (tabButtons.length > 0 && tabPanels.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const dayId = btn.getAttribute('data-day');

                tabButtons.forEach(b => b.classList.remove('schedule__tab--active'));
                btn.classList.add('schedule__tab--active');

                tabPanels.forEach(panel => {
                    panel.classList.remove('schedule__day--active');
                });

                const targetDay = document.getElementById(dayId);
                if (targetDay) targetDay.classList.add('schedule__day--active');
            });
        });
    }

    // --- i18n helper ---
    const isEnglish = document.documentElement.lang === 'en';

    // --- Newsletter Form (Web3Forms) ---
    const newsletterForms = document.querySelectorAll('.newsletter__form');

    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('.newsletter__input');
            const btn = form.querySelector('.newsletter__btn');
            const successMsg = form.parentElement.querySelector('.newsletter__success');

            if (!input || !input.value || !input.validity.valid) return;

            btn.disabled = true;
            var data = new FormData(form);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: data
            }).then(function(res) {
                return res.json();
            }).then(function(json) {
                if (json.success) {
                    form.style.display = 'none';
                    if (successMsg) successMsg.style.display = 'block';
                } else {
                    btn.disabled = false;
                    alert(isEnglish ? 'Error. Please try again later.' : 'Errore. Riprova più tardi.');
                }
            }).catch(function() {
                btn.disabled = false;
                alert(isEnglish ? 'Network error. Please try again later.' : 'Errore di rete. Riprova più tardi.');
            });
        });
    });

    // --- Contact Form (legacy fallback for forms without Web3Forms) ---
    const contactForm = document.querySelector('.contact-form:not([action])');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.contact-form__submit');

            if (contactForm.checkValidity()) {
                const originalText = btn.textContent;
                btn.textContent = isEnglish ? 'Message sent!' : 'Messaggio inviato!';
                btn.style.background = '#2d6a4f';
                btn.disabled = true;
                contactForm.reset();

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            } else {
                contactForm.reportValidity();
            }
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookieBanner');
    if (cookieBanner && !localStorage.getItem('baff_cookie_consent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1500);

        const acceptBtn = document.getElementById('cookieAccept');
        const rejectBtn = document.getElementById('cookieReject');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('baff_cookie_consent', 'accepted');
                cookieBanner.classList.remove('visible');
            });
        }

        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => {
                localStorage.setItem('baff_cookie_consent', 'rejected');
                cookieBanner.classList.remove('visible');
            });
        }
    }

    // --- Back to Top button ---
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Scroll animations (Intersection Observer) ---
    const fadeElements = document.querySelectorAll('.featured__main, .featured__card, .program__card, .info__card, .countdown__container, .newsletter__container, .stats__item, .timeline__item, .guest-card, .ticket-card');

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
