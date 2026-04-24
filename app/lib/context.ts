import { createStorefrontClient, createCartHandler, cartGetIdDefault, cartSetIdDefault } from '@shopify/hydrogen';

/**
 * IP → Country mapping for Asian markets.
 * In production with Oxygen, `oxygen-buyer-ip` header provides real geolocation.
 * This implementation maps country codes to Storefront API CountryCode + LanguageCode enums.
 */
const COUNTRY_LOCALE_MAP: Record<string, { country: string; language: string; currency: string }> = {
    JP: { country: 'JP', language: 'JA', currency: 'JPY' },
    CN: { country: 'CN', language: 'ZH', currency: 'CNY' },
    TW: { country: 'TW', language: 'ZH', currency: 'TWD' },
    TH: { country: 'TH', language: 'TH', currency: 'THB' },
    KR: { country: 'KR', language: 'KO', currency: 'KRW' },
    US: { country: 'US', language: 'EN', currency: 'USD' },
    // EU countries → EUR
    DE: { country: 'DE', language: 'DE', currency: 'EUR' },
    FR: { country: 'FR', language: 'FR', currency: 'EUR' },
    IT: { country: 'IT', language: 'IT', currency: 'EUR' },
    ES: { country: 'ES', language: 'ES', currency: 'EUR' },
    NL: { country: 'NL', language: 'NL', currency: 'EUR' },
    // UK → GBP (bonus)
    GB: { country: 'GB', language: 'EN', currency: 'GBP' },
};

const DEFAULT_LOCALE = { country: 'US', language: 'EN', currency: 'USD' };

/**
 * Detect buyer's country from request headers.
 * Shopify Oxygen sets `oxygen-buyer-country` or use `cf-ipcountry` for Cloudflare.
 */
function detectLocale(request: Request) {
    const headers = request.headers;

    // Oxygen environment
    const oxygenCountry = headers.get('oxygen-buyer-country');
    if (oxygenCountry && COUNTRY_LOCALE_MAP[oxygenCountry]) {
        return COUNTRY_LOCALE_MAP[oxygenCountry];
    }

    // Cloudflare fallback
    const cfCountry = headers.get('cf-ipcountry');
    if (cfCountry && COUNTRY_LOCALE_MAP[cfCountry]) {
        return COUNTRY_LOCALE_MAP[cfCountry];
    }

    // Accept-Language header fallback
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
 * Create the app load context with Storefront client and Cart handler,
 * localized via @inContext directive based on detected buyer location.
 */
export async function createAppLoadContext(
    request: Request,
    env: Env,
    executionContext: { waitUntil: (promise: Promise<any>) => void },
) {
    const locale = detectLocale(request);

    /**
     * Create Storefront client with @inContext localization.
     */
    const { storefront } = createStorefrontClient({
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        storefrontApiVersion: env.PUBLIC_STOREFRONT_API_VERSION || '2024-10',
        i18n: {
            language: locale.language as any,
            country: locale.country as any,
        },
    });

    /**
     * Create Cart handler for Storefront API cart mutations.
     */
    const cart = createCartHandler({
        storefront,
        getCartId: cartGetIdDefault(request.headers),
        setCartId: cartSetIdDefault(),
    });

    return {
        storefront,
        cart,
        env,
        locale,
        waitUntil: executionContext.waitUntil.bind(executionContext),
    };
}
