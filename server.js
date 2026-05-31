import { createAppLoadContext } from '~/lib/context';

/**
 * Vercel-compatible server entry point.
 * Minimal implementation that avoids Node.js built-in module dependencies.
 * The actual request handling is delegated to the Vercel adapter.
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

            // The Remix handler is provided by the Vercel adapter
            // This is a minimal pass-through that lets Vercel handle the routing
            const { createRequestHandler } = await import('@remix-run/server-runtime');
            
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