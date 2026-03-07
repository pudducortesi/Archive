(function () {
    'use strict';

    var buttons = document.querySelectorAll('.storia-years__btn');
    var entries = document.querySelectorAll('.storia-entry');
    var select = document.getElementById('storiaSelect');

    if (!buttons.length || !entries.length) return;

    function showYear(year) {
        entries.forEach(function (entry) {
            entry.classList.toggle('active', entry.getAttribute('data-year') === year);
        });
        buttons.forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-year') === year);
        });
        if (select) select.value = year;
    }

    // Default: most recent year (2024)
    showYear('2024');

    // Desktop buttons
    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            showYear(this.getAttribute('data-year'));
        });
    });

    // Mobile select
    if (select) {
        select.addEventListener('change', function () {
            showYear(this.value);
        });
    }

    // ---- Lightbox for locandine ----
    var lb = document.getElementById('storiaLightbox');
    var lbImg = document.getElementById('storiaLbImg');
    var lbCaption = document.getElementById('storiaLbCaption');
    var lbClose = document.getElementById('storiaLbClose');
    var lbPrev = document.getElementById('storiaLbPrev');
    var lbNext = document.getElementById('storiaLbNext');

    if (!lb) return;

    var currentItems = [];
    var currentIndex = 0;

    function collectVisibleItems() {
        var activeEntry = document.querySelector('.storia-entry.active');
        if (!activeEntry) return [];
        var items = activeEntry.querySelectorAll('.storia-locandina[data-storia-src]');
        return Array.prototype.slice.call(items);
    }

    function openLightbox(index) {
        currentItems = collectVisibleItems();
        if (!currentItems.length || index < 0 || index >= currentItems.length) return;
        currentIndex = index;
        var item = currentItems[currentIndex];
        lbImg.src = item.getAttribute('data-storia-src');
        lbImg.alt = item.getAttribute('data-storia-alt') || '';
        lbCaption.textContent = item.getAttribute('data-storia-alt') || '';
        lbPrev.style.display = currentItems.length > 1 ? '' : 'none';
        lbNext.style.display = currentItems.length > 1 ? '' : 'none';
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lb.classList.remove('active');
        document.body.style.overflow = '';
        lbImg.src = '';
    }

    function showPrev() {
        if (currentItems.length < 2) return;
        currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
        var item = currentItems[currentIndex];
        lbImg.src = item.getAttribute('data-storia-src');
        lbImg.alt = item.getAttribute('data-storia-alt') || '';
        lbCaption.textContent = item.getAttribute('data-storia-alt') || '';
    }

    function showNext() {
        if (currentItems.length < 2) return;
        currentIndex = (currentIndex + 1) % currentItems.length;
        var item = currentItems[currentIndex];
        lbImg.src = item.getAttribute('data-storia-src');
        lbImg.alt = item.getAttribute('data-storia-alt') || '';
        lbCaption.textContent = item.getAttribute('data-storia-alt') || '';
    }

    // Click on locandina images
    document.addEventListener('click', function (e) {
        var card = e.target.closest('.storia-locandina[data-storia-src]');
        if (!card) return;
        var items = collectVisibleItems();
        var idx = items.indexOf(card);
        if (idx !== -1) openLightbox(idx);
    });

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', showPrev);
    lbNext.addEventListener('click', showNext);

    lb.addEventListener('click', function (e) {
        if (e.target === lb) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
})();
