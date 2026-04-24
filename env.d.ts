/// <reference types="vite/client" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

import type { Storefront, HydrogenCart } from '@shopify/hydrogen';

declare global {
    /**
     * A global `process` object is only available during build to access NODE_ENV.
     */
    const process: { env: { NODE_ENV: 'production' | 'development' } };

    /**
     * Declare expected Env parameter in fetch handler.
     */
    interface Env {
        SESSION_SECRET: string;
        PUBLIC_STOREFRONT_API_TOKEN: string;
        PUBLIC_STORE_DOMAIN: string;
        PUBLIC_STOREFRONT_API_VERSION: string;
        STRIPE_SECRET_KEY: string;
        STRIPE_PUBLIC_KEY: string;
    }
}

declare module '@shopify/remix-oxygen' {
    interface AppLoadContext {
        storefront: Storefront;
        cart: HydrogenCart;
        env: Env;
        waitUntil: ExecutionContext['waitUntil'];
    }
}
