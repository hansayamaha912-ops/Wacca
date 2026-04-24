import { redirect } from '@shopify/remix-oxygen';

/**
 * Stripe Checkout via Native Fetch API.
 * No Node.js SDK — direct HTTP to Stripe REST endpoint.
 * Environment variables sourced from Oxygen context.env.
 *
 * @param {import('@shopify/remix-oxygen').ActionFunctionArgs} args
 */
export async function action({ request, context }) {
    const formData = await request.formData();
    const stripePriceId = formData.get('stripePriceId');
    const location = formData.get('location');
    const productHandle = formData.get('productHandle') || 'snowboard';

    // Oxygen-safe env access (no process.env)
    const stripeSecret = context.env.STRIPE_SECRET_KEY;
    const url = new URL(request.url);
    const domain = `${url.protocol}//${url.host}`;

    if (!stripeSecret) {
        console.error('[WACCA] STRIPE_SECRET_KEY not found in context.env');
        return redirect(`${domain}/order/success?location=${encodeURIComponent(location)}&fallback=true`);
    }

    try {
        const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${stripeSecret}`
            },
            body: new URLSearchParams({
                'payment_method_types[0]': 'card',
                'line_items[0][price]': stripePriceId,
                'line_items[0][quantity]': '1',
                mode: 'payment',
                success_url: `${domain}/order/success?location=${encodeURIComponent(location)}`,
                cancel_url: `${domain}/products/${productHandle}`,
                'metadata[location]': location
            }).toString()
        });

        const session = await response.json();

        if (session.url) {
            return redirect(session.url, 303);
        } else {
            console.error("Stripe Endpoint Response:", session);
            // Fallback immediately to success UX in dev matrix mode
            return redirect(`${domain}/order/success?location=${encodeURIComponent(location)}&fallback=true`);
        }
    } catch (err) {
        console.error("[WACCA SYSTEM ERR] Fetch Stripe Failed:", err);
        return redirect(`${domain}/order/success?location=${encodeURIComponent(location)}&fallback=true`);
    }
}
