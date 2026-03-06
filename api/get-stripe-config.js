// Vercel Serverless Function — Serve Stripe public config to the frontend
//
// Returns the publishable key and price IDs from environment variables
// so that no keys are hardcoded in client-side code.

module.exports = (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Cache-Control', 'public, max-age=300');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const pk = process.env.STRIPE_PUBLISHABLE_KEY;
    if (!pk) {
        return res.status(500).json({ error: 'Stripe not configured' });
    }

    return res.status(200).json({
        publishableKey: pk,
        prices: {
            'single':           process.env.STRIPE_PRICE_SINGLE           || '',
            'single-reduced':   process.env.STRIPE_PRICE_SINGLE_REDUCED   || '',
            'daily':            process.env.STRIPE_PRICE_DAILY            || '',
            'festival':         process.env.STRIPE_PRICE_FESTIVAL         || '',
            'festival-reduced': process.env.STRIPE_PRICE_FESTIVAL_REDUCED || '',
        },
    });
};
