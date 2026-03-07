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
})();
