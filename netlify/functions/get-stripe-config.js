// Netlify Serverless Function — Serve Stripe public config to the frontend
//
// Returns the publishable key and price IDs from environment variables
// so that no keys are hardcoded in client-side code.

exports.handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, max-age=300',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const pk = process.env.STRIPE_PUBLISHABLE_KEY;
    if (!pk) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Stripe not configured' }),
        };
    }

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            publishableKey: pk,
            prices: {
                'single':           process.env.STRIPE_PRICE_SINGLE           || '',
                'single-reduced':   process.env.STRIPE_PRICE_SINGLE_REDUCED   || '',
                'daily':            process.env.STRIPE_PRICE_DAILY            || '',
                'festival':         process.env.STRIPE_PRICE_FESTIVAL         || '',
                'festival-reduced': process.env.STRIPE_PRICE_FESTIVAL_REDUCED || '',
            },
        }),
    };
};
