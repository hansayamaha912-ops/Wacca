import { createRequestHandler } from '@remix-run/dev';
import { createAppLoadContext } from '~/lib/context';

/**
 * Vercel-compatible server entry point.
 * Uses standard Remix request handler instead of Oxygen-specific one.
 */
export default {
    async fetch(request, env, executionContext) {
        try {
            // Create app context with mock implementations
            const appLoadContext = await createAppLoadContext(
                request,
                env,
                executionContext,
            );

            /**
             * Create a standard Remix request handler.
             * Uses @remix-run/dev instead of @shopify/remix-oxygen for Vercel compatibility.
             */
            const handleRequest = createRequestHandler({
                build: await import('virtual:remix/server-build'),
                mode: process.env.NODE_ENV || 'production',
                getLoadContext: () => appLoadContext,
            });

            const response = await handleRequest(request);

            return response;
        } catch (error) {
            console.error('Server error:', error);
            return new Response('An unexpected error occurred', { 
                status: 500,
                headers: { 'Content-Type': 'text/plain' }
            });
        }
    },
};