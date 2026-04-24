import { CartForm } from '@shopify/hydrogen';
import { redirect } from '@remix-run/server-runtime';

/**
 * Cart route only handles POST actions.
 * GET requests redirect to homepage.
 */
export async function loader() {
    return redirect('/');
}

/**
 * Cart action route — handles CartForm submissions.
 *
 * @param {import('@shopify/remix-oxygen').ActionFunctionArgs} args
 */
export async function action({ request, context }) {
    const { cart } = context;

    const formData = await request.formData();
    const { action, inputs } = CartForm.getFormInput(formData);

    let result;

    switch (action) {
        case CartForm.ACTIONS.LinesAdd:
            result = await cart.addLines(inputs.lines);
            break;

        case CartForm.ACTIONS.LinesUpdate:
            result = await cart.updateLines(inputs.lines);
            break;

        case CartForm.ACTIONS.LinesRemove:
            result = await cart.removeLines(inputs.lineIds);
            break;

        case CartForm.ACTIONS.DiscountCodesUpdate:
            result = await cart.updateDiscountCodes(inputs.discountCodes);
            break;

        default:
            throw new Error(`Unhandled cart action: ${action}`);
    }

    const headers = cart.setCartId(result.cart.id);

    return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
            ...Object.fromEntries(headers.entries()),
            'Content-Type': 'application/json',
        },
    });
}
