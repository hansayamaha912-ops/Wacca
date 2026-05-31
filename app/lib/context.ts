/**
 * Vercel-compatible context module.
 * All Shopify/Hydrogen API calls have been removed to prevent
 * FUNCTION_INVOCATION_FAILED errors on Vercel serverless environment.
 * 
 * This provides mock/stub implementations that allow the site to function
 * without any external API dependencies.
 */

/**
 * IP → Country mapping for Asian markets.
 */
const COUNTRY_LOCALE_MAP: Record<string, { country: string; language: string; currency: string }> = {
    JP: { country: 'JP', language: 'JA', currency: 'JPY' },
    CN: { country: 'CN', language: 'ZH', currency: 'CNY' },
    TW: { country: 'TW', language: 'ZH', currency: 'TWD' },
    TH: { country: 'TH', language: 'TH', currency: 'THB' },
    KR: { country: 'KR', language: 'KO', currency: 'KRW' },
    US: { country: 'US', language: 'EN', currency: 'USD' },
    DE: { country: 'DE', language: 'DE', currency: 'EUR' },
    FR: { country: 'FR', language: 'FR', currency: 'EUR' },
    IT: { country: 'IT', language: 'IT', currency: 'EUR' },
    ES: { country: 'ES', language: 'ES', currency: 'EUR' },
    NL: { country: 'NL', language: 'NL', currency: 'EUR' },
    GB: { country: 'GB', language: 'EN', currency: 'GBP' },
};

const DEFAULT_LOCALE = { country: 'US', language: 'EN', currency: 'USD' };

/**
 * Detect buyer's country from request headers.
 */
function detectLocale(request: Request) {
    const headers = request.headers;

    const oxygenCountry = headers.get('oxygen-buyer-country');
    if (oxygenCountry && COUNTRY_LOCALE_MAP[oxygenCountry]) {
        return COUNTRY_LOCALE_MAP[oxygenCountry];
    }

    const cfCountry = headers.get('cf-ipcountry');
    if (cfCountry && COUNTRY_LOCALE_MAP[cfCountry]) {
        return COUNTRY_LOCALE_MAP[cfCountry];
    }

    const acceptLang = headers.get('accept-language') || '';
    if (acceptLang.includes('ja')) return COUNTRY_LOCALE_MAP['JP'];
    if (acceptLang.includes('zh-TW') || acceptLang.includes('zh-Hant')) return COUNTRY_LOCALE_MAP['TW'];
    if (acceptLang.includes('zh')) return COUNTRY_LOCALE_MAP['CN'];
    if (acceptLang.includes('th')) return COUNTRY_LOCALE_MAP['TH'];
    if (acceptLang.includes('ko')) return COUNTRY_LOCALE_MAP['KR'];
    if (acceptLang.includes('de')) return COUNTRY_LOCALE_MAP['DE'];
    if (acceptLang.includes('fr')) return COUNTRY_LOCALE_MAP['FR'];
    if (acceptLang.includes('es')) return COUNTRY_LOCALE_MAP['ES'];
    if (acceptLang.includes('it')) return COUNTRY_LOCALE_MAP['IT'];
    if (acceptLang.includes('en')) return COUNTRY_LOCALE_MAP['US'];

    return DEFAULT_LOCALE;
}

/**
 * Mock Storefront client - no actual API calls.
 * Returns stub functions that return null/empty data.
 */
function createMockStorefrontClient() {
    return {
        storefront: {
            query: async () => ({ data: null }),
        },
    };
}

/**
 * Mock Cart handler - no actual API calls.
 * Returns stub functions for cart operations.
 */
function createMockCartHandler() {
    const mockCart = {
        getCartId: () => null,
        setCartId: () => new Headers(),
        addLines: async () => ({ cart: { id: 'mock-cart-id', lines: { nodes: [] } } }),
        updateLines: async () => ({ cart: { id: 'mock-cart-id', lines: { nodes: [] } } }),
        removeLines: async () => ({ cart: { id: 'mock-cart-id', lines: { nodes: [] } } }),
        updateDiscountCodes: async () => ({ cart: { id: 'mock-cart-id', lines: { nodes: [] } } }),
    };
    return mockCart;
}

/**
 * Create the app load context with mock implementations.
 * No external API calls are made - this ensures Vercel deployment works reliably.
 */
export async function createAppLoadContext(
    request: Request,
    env: { PUBLIC_STORE_DOMAIN?: string; PUBLIC_STOREFRONT_API_TOKEN?: string; PUBLIC_STOREFRONT_API_VERSION?: string },
    executionContext: { waitUntil: (promise: Promise<any>) => void },
) {
    const locale = detectLocale(request);

    // Use mock implementations instead of real Shopify API clients
    const { storefront } = createMockStorefrontClient();
    const cart = createMockCartHandler();

    return {
        storefront,
        cart,
        env: env as any,
        locale,
        waitUntil: executionContext.waitUntil.bind(executionContext),
    };
}