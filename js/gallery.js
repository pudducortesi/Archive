(function () {
    'use strict';

    // --- Filter buttons ---
    var filterBtns = document.querySelectorAll('.gallery-filters__btn');
    var items = document.querySelectorAll('.gallery-item');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var lightboxClose = document.getElementById('lightboxClose');
    var lightboxPrev = document.getElementById('lightboxPrev');
    var lightboxNext = document.getElementById('lightboxNext');

    if (!filterBtns.length || !items.length) return;

    var visibleItems = [];
    var currentIndex = 0;

    function updateVisible() {
        visibleItems = [];
        items.forEach(function (item) {
            if (!item.classList.contains('gallery-item--hidden')) {
                visibleItems.push(item);
            }
        });
    }

    function filterByYear(year) {
        items.forEach(function (item) {
            if (year === 'all' || item.getAttribute('data-year') === year) {
                item.classList.remove('gallery-item--hidden');
            } else {
                item.classList.add('gallery-item--hidden');
            }
        });
        updateVisible();
    }

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            filterByYear(btn.getAttribute('data-year'));
        });
    });

    // Init
    updateVisible();

    // --- Lightbox ---
    function openLightbox(index) {
        if (index < 0 || index >= visibleItems.length) return;
        currentIndex = index;
        var img = visibleItems[index].querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = 'BAFF ' + visibleItems[index].getAttribute('data-year');
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImg.src = '';
    }

    function prevImage() {
        if (visibleItems.length === 0) return;
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        openLightbox(currentIndex);
    }

    function nextImage() {
        if (visibleItems.length === 0) return;
        currentIndex = (currentIndex + 1) % visibleItems.length;
        openLightbox(currentIndex);
    }

    // Click on gallery items
    items.forEach(function (item) {
        item.addEventListener('click', function () {
            var idx = visibleItems.indexOf(item);
            if (idx !== -1) openLightbox(idx);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);

    // Click backdrop to close
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox || e.target === document.querySelector('.lightbox__content')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });
})();
