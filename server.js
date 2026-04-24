import { createRequestHandler } from '@shopify/remix-oxygen';
import { createAppLoadContext } from '~/lib/context';

export default {
    async fetch(request, env, executionContext) {
        try {
            const appLoadContext = await createAppLoadContext(
                request,
                env,
                executionContext,
            );

            /**
             * Create a Remix request handler and pass
             * Hydrogen's Storefront client to the loader context.
             */
            const handleRequest = createRequestHandler({
                build: await import('virtual:remix/server-build'),
                mode: process.env.NODE_ENV,
                getLoadContext: () => appLoadContext,
            });

            const response = await handleRequest(request);

            if (appLoadContext.cart.setCartId) {
                // Set cart cookie
                const cartId = appLoadContext.cart.getCartId();
                // The cart handler manages cookies automatically
            }

            return response;
        } catch (error) {
            console.error(error);
            return new Response('An unexpected error occurred', { status: 500 });
        }
    },
};
