/* ============================================
   B.A. Film Festival — Shop / Cart + Stripe Checkout
   ============================================ */
(function () {
    'use strict';

    /* ── CONFIGURAZIONE STRIPE ─────────────────────────────
       1. Vai su https://dashboard.stripe.com/apikeys
          e copia la Publishable Key (pk_live_... o pk_test_...)
       2. Vai su https://dashboard.stripe.com/products
          crea i 5 prodotti con i prezzi indicati
          e copia ogni Price ID (price_...) qui sotto
       ────────────────────────────────────────────────────── */
    var STRIPE_PUBLISHABLE_KEY = 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX';

    var STRIPE_PRICES = {
        'single':           'price_XXXXXXXXXXXXXXXX',   // Singolo Ingresso        – €8
        'single-reduced':   'price_XXXXXXXXXXXXXXXX',   // Singolo Ridotto         – €5
        'daily':            'price_XXXXXXXXXXXXXXXX',   // Abb. Giornaliero        – €20
        'festival':         'price_XXXXXXXXXXXXXXXX',   // Abb. Festival           – €80
        'festival-reduced': 'price_XXXXXXXXXXXXXXXX'    // Abb. Festival Ridotto   – €60
    };

    // Endpoint serverless function (Netlify Functions)
    var CHECKOUT_API = '/.netlify/functions/create-checkout-session';

    /* ────────────────────────────────────────────────────── */

    var items = document.querySelectorAll('.shop-item');
    var cartItemsEl = document.getElementById('cartItems');
    var cartTotalEl = document.getElementById('cartTotal');
    var submitBtn = document.getElementById('checkoutSubmit');
    var form = document.getElementById('checkoutForm');

    if (!items.length || !cartItemsEl) return;

    var lang = document.documentElement.lang || 'it';
    var isIT = lang === 'it';
    var emptyText = isIT ? 'Nessun biglietto selezionato' : 'No tickets selected';
    var loadingText = isIT ? 'Reindirizzamento a Stripe\u2026' : 'Redirecting to Stripe\u2026';
    var errorText = isIT
        ? 'Si \u00e8 verificato un errore. Riprova tra qualche istante.'
        : 'Something went wrong. Please try again in a moment.';
    var defaultBtnText = isIT ? 'Procedi al pagamento' : 'Proceed to payment';

    function formatPrice(cents) {
        var euros = (cents / 100).toFixed(2);
        if (isIT) euros = euros.replace('.', ',');
        return '\u20AC' + euros;
    }

    /* ── Carrello ───────────────────────────────────────── */

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

    /* ── Pulsanti quantità ──────────────────────────────── */

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

    /* ── Checkout → Stripe ──────────────────────────────── */

    function getLineItems() {
        var lineItems = [];
        items.forEach(function (item) {
            var qty = parseInt(item.querySelector('[data-qty]').textContent, 10) || 0;
            if (qty > 0) {
                var productId = item.dataset.product;
                lineItems.push({
                    price: STRIPE_PRICES[productId],
                    quantity: qty
                });
            }
        });
        return lineItems;
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var lineItems = getLineItems();
            if (lineItems.length === 0) return;

            // Loading state
            submitBtn.disabled = true;
            submitBtn.textContent = loadingText;

            var emailEl = document.getElementById('checkoutEmail');
            var email = emailEl ? emailEl.value.trim() : '';

            var origin = window.location.origin;
            var successUrl = origin + (isIT ? '/shop-success.html' : '/en/shop-success.html');
            var cancelUrl = window.location.href;

            fetch(CHECKOUT_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    line_items: lineItems,
                    customer_email: email || undefined,
                    success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
                    cancel_url: cancelUrl,
                    locale: lang
                })
            })
            .then(function (res) {
                if (!res.ok) throw new Error('API ' + res.status);
                return res.json();
            })
            .then(function (data) {
                window.location.href = data.url;
            })
            .catch(function () {
                submitBtn.disabled = false;
                submitBtn.textContent = defaultBtnText;
                alert(errorText);
            });
        });
    }

    // Initial state
    updateCart();
})();
