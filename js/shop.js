/* ============================================
   B.A. Film Festival — Shop / Cart + Stripe Checkout
   ============================================ */
(function () {
    'use strict';

    /* ── Endpoints ────────────────────────────────────────── */
    var CONFIG_API   = '/api/get-stripe-config';
    var CHECKOUT_API = '/api/create-checkout-session';

    /* ── DOM refs ─────────────────────────────────────────── */
    var items      = document.querySelectorAll('.shop-item');
    var cartItemsEl = document.getElementById('cartItems');
    var cartTotalEl = document.getElementById('cartTotal');
    var submitBtn   = document.getElementById('checkoutSubmit');
    var form        = document.getElementById('checkoutForm');

    if (!items.length || !cartItemsEl) return;

    /* ── i18n ─────────────────────────────────────────────── */
    var lang = document.documentElement.lang || 'it';
    var isIT = lang === 'it';
    var emptyText   = isIT ? 'Nessun biglietto selezionato' : 'No tickets selected';
    var loadingText = isIT ? 'Reindirizzamento a Stripe\u2026' : 'Redirecting to Stripe\u2026';
    var errorText   = isIT
        ? 'Si \u00e8 verificato un errore. Riprova tra qualche istante.'
        : 'Something went wrong. Please try again in a moment.';
    var configErrorText = isIT
        ? 'Impossibile caricare la configurazione di pagamento. Ricarica la pagina.'
        : 'Unable to load payment configuration. Please reload the page.';
    var defaultBtnText = isIT ? 'Procedi al pagamento' : 'Proceed to payment';

    /* ── Stripe config (loaded async) ─────────────────────── */
    var STRIPE_PRICES = null;

    function loadStripeConfig() {
        return fetch(CONFIG_API)
            .then(function (res) {
                if (!res.ok) throw new Error('Config API ' + res.status);
                return res.json();
            })
            .then(function (data) {
                STRIPE_PRICES = data.prices;
            })
            .catch(function () {
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = configErrorText;
                }
            });
    }

    loadStripeConfig();

    /* ── Helpers ───────────────────────────────────────────── */

    function formatPrice(cents) {
        var euros = (cents / 100).toFixed(2);
        if (isIT) euros = euros.replace('.', ',');
        return '\u20AC' + euros;
    }

    /* ── Cart ──────────────────────────────────────────────── */

    function updateCart() {
        var lines = [];
        var total = 0;

        items.forEach(function (item) {
            var qty = parseInt(item.querySelector('[data-qty]').textContent, 10) || 0;
            if (qty > 0) {
                var price = parseInt(item.dataset.price, 10) * 100;
                var name  = item.querySelector('.shop-item__name').textContent.trim();
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

    /* ── Quantity buttons ─────────────────────────────────── */

    items.forEach(function (item) {
        var qtyEl = item.querySelector('[data-qty]');
        var btns  = item.querySelectorAll('.shop-item__qty-btn');
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

    /* ── Checkout → Stripe ────────────────────────────────── */

    function getLineItems() {
        var lineItems = [];
        if (!STRIPE_PRICES) return lineItems;

        items.forEach(function (item) {
            var qty = parseInt(item.querySelector('[data-qty]').textContent, 10) || 0;
            if (qty > 0) {
                var productId = item.dataset.product;
                var priceId   = STRIPE_PRICES[productId];
                if (priceId) {
                    lineItems.push({ price: priceId, quantity: qty });
                }
            }
        });
        return lineItems;
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var lineItems = getLineItems();
            if (lineItems.length === 0) return;

            submitBtn.disabled = true;
            submitBtn.textContent = loadingText;

            var emailEl = document.getElementById('checkoutEmail');
            var email   = emailEl ? emailEl.value.trim() : '';

            var origin     = window.location.origin;
            var successUrl = origin + (isIT ? '/shop-success.html' : '/en/shop-success.html');
            var cancelUrl  = window.location.href;

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
