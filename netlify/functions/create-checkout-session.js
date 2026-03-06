// Netlify Serverless Function — Crea una Stripe Checkout Session
//
// Variabili d'ambiente necessarie (da impostare su Netlify):
//   STRIPE_SECRET_KEY            = sk_live_... (o sk_test_... per test)
//   STRIPE_PRICE_SINGLE          = price_...
//   STRIPE_PRICE_SINGLE_REDUCED  = price_...
//   STRIPE_PRICE_DAILY           = price_...
//   STRIPE_PRICE_FESTIVAL        = price_...
//   STRIPE_PRICE_FESTIVAL_REDUCED= price_...

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Whitelist of allowed Price IDs (from env)
const ALLOWED_PRICES = new Set([
    process.env.STRIPE_PRICE_SINGLE,
    process.env.STRIPE_PRICE_SINGLE_REDUCED,
    process.env.STRIPE_PRICE_DAILY,
    process.env.STRIPE_PRICE_FESTIVAL,
    process.env.STRIPE_PRICE_FESTIVAL_REDUCED,
].filter(Boolean));

const CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event) => {
    // CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers: CORS_HEADERS, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const { line_items, customer_email, success_url, cancel_url, locale } = JSON.parse(event.body);

        // Validate line items exist
        if (!line_items || !line_items.length) {
            return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'No line items' }) };
        }

        // Validate all price IDs are in our whitelist
        for (const item of line_items) {
            if (!item.price || !ALLOWED_PRICES.has(item.price)) {
                return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid price ID' }) };
            }
            if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
                return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid quantity' }) };
            }
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: line_items,
            customer_email: customer_email || undefined,
            success_url: success_url,
            cancel_url: cancel_url,
            locale: locale === 'it' ? 'it' : 'en',
        });

        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify({ url: session.url }),
        };
    } catch (err) {
        console.error('Stripe error:', err.message);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
