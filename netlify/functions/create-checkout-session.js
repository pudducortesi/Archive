// Netlify Serverless Function — Crea una Stripe Checkout Session
//
// Variabili d'ambiente necessarie (da impostare su Netlify):
//   STRIPE_SECRET_KEY = sk_live_... (o sk_test_... per test)
//
// Installa la dipendenza:
//   cd netlify/functions && npm install stripe

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
    // Solo POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const { line_items, customer_email, success_url, cancel_url, locale } = JSON.parse(event.body);

        // Validazione base
        if (!line_items || !line_items.length) {
            return { statusCode: 400, body: JSON.stringify({ error: 'No line items' }) };
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
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ url: session.url }),
        };
    } catch (err) {
        console.error('Stripe error:', err.message);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: err.message }),
        };
    }
};
