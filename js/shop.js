/* ============================================
   B.A. Film Festival — Shop / Cart
   ============================================ */
(function () {
    'use strict';

    var items = document.querySelectorAll('.shop-item');
    var cartItemsEl = document.getElementById('cartItems');
    var cartTotalEl = document.getElementById('cartTotal');
    var submitBtn = document.getElementById('checkoutSubmit');
    var form = document.getElementById('checkoutForm');

    if (!items.length || !cartItemsEl) return;

    // Detect locale from <html lang>
    var lang = document.documentElement.lang || 'it';
    var isIT = lang === 'it';
    var emptyText = isIT ? 'Nessun biglietto selezionato' : 'No tickets selected';
    var confirmTitle = isIT ? 'Ordine confermato!' : 'Order confirmed!';
    var confirmText = isIT
        ? 'Grazie per il tuo acquisto. Riceverai i biglietti all\u2019indirizzo email indicato entro pochi minuti.'
        : 'Thank you for your purchase. You will receive your tickets at the email address provided within a few minutes.';
    var confirmBtn = isIT ? 'Torna alla home' : 'Back to home';
    var pcsLabel = isIT ? 'pz' : 'pcs';

    function formatPrice(cents) {
        var euros = (cents / 100).toFixed(2);
        if (isIT) euros = euros.replace('.', ',');
        return '\u20AC' + euros;
    }

    function updateCart() {
        var lines = [];
        var total = 0;

        items.forEach(function (item) {
            var qty = parseInt(item.querySelector('[data-qty]').textContent, 10) || 0;
            if (qty > 0) {
                var price = parseInt(item.dataset.price, 10) * 100;
                var name = item.querySelector('.shop-item__name').textContent.trim();
                var lineTotal = price * qty;
                total += lineTotal;
                lines.push({ name: name, qty: qty, total: lineTotal });
            }
        });

        if (lines.length === 0) {
            cartItemsEl.innerHTML = '<p class="shop-cart__empty">' + emptyText + '</p>';
        } else {
            var html = '';
            lines.forEach(function (l) {
                html += '<div class="shop-cart__line">'
                    + '<span class="shop-cart__line-name">' + l.name + '</span>'
                    + '<span class="shop-cart__line-qty">&times;' + l.qty + '</span>'
                    + '<span class="shop-cart__line-price">' + formatPrice(l.total) + '</span>'
                    + '</div>';
            });
            cartItemsEl.innerHTML = html;
        }

        cartTotalEl.textContent = formatPrice(total);

        if (submitBtn) {
            submitBtn.disabled = total === 0;
        }
    }

    // Quantity buttons
    items.forEach(function (item) {
        var qtyEl = item.querySelector('[data-qty]');
        var btns = item.querySelectorAll('.shop-item__qty-btn');
        btns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var current = parseInt(qtyEl.textContent, 10) || 0;
                if (btn.dataset.action === 'increase') {
                    current = Math.min(current + 1, 20);
                } else {
                    current = Math.max(current - 1, 0);
                }
                qtyEl.textContent = current;
                updateCart();
            });
        });
    });

    // Form submit
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Check that at least one item is selected
            var hasItems = false;
            items.forEach(function (item) {
                var qty = parseInt(item.querySelector('[data-qty]').textContent, 10) || 0;
                if (qty > 0) hasItems = true;
            });
            if (!hasItems) return;

            showConfirmation();
        });
    }

    function showConfirmation() {
        var overlay = document.createElement('div');
        overlay.className = 'shop-confirmation visible';
        overlay.innerHTML = '<div class="shop-confirmation__box">'
            + '<div class="shop-confirmation__icon">'
            + '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
            + '<circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>'
            + '</div>'
            + '<h3 class="shop-confirmation__title">' + confirmTitle + '</h3>'
            + '<p class="shop-confirmation__text">' + confirmText + '</p>'
            + '<button class="shop-confirmation__btn" id="confirmClose">' + confirmBtn + '</button>'
            + '</div>';
        document.body.appendChild(overlay);

        document.getElementById('confirmClose').addEventListener('click', function () {
            window.location.href = isIT ? 'index.html' : 'index.html';
        });

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    // Initial state
    updateCart();
})();
