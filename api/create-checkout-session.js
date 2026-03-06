// Vercel Serverless Function — Crea una Stripe Checkout Session
//
// Variabili d'ambiente necessarie (da impostare su Vercel):
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

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Preflight
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { line_items, customer_email, success_url, cancel_url, locale } = req.body;

        // Validate line items exist
        if (!line_items || !line_items.length) {
            return res.status(400).json({ error: 'No line items' });
        }

        // Validate all price IDs are in our whitelist
        for (const item of line_items) {
            if (!item.price || !ALLOWED_PRICES.has(item.price)) {
                return res.status(400).json({ error: 'Invalid price ID' });
            }
            if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
                return res.status(400).json({ error: 'Invalid quantity' });
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

        return res.status(200).json({ url: session.url });
    } catch (err) {
        console.error('Stripe error:', err.message);
        return res.status(500).json({ error: err.message });
    }
};
