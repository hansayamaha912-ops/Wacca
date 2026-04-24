import { useState } from 'react';
import { useLoaderData, Link } from '@remix-run/react';
import { Money, Image } from '@shopify/hydrogen';
import WhatsUr20Input from '~/components/ui/WhatsUr20Input';
import CheckoutButton from '~/components/cart/CheckoutButton';
import ClientOnlyBackgroundCity from '~/components/3d/ClientOnlyBackgroundCity';
import { WACCA_PRODUCTS } from '~/constants/products';
import angrKunImage from '~/assets/images/products/angr-kun-pro-angle.jpg';

/**
 * @type {import('@remix-run/server-runtime').MetaFunction}
 */
export const meta = ({ data }) => {
    const title = data?.product?.title ? `${data.product.title} | WACCA` : 'Product | WACCA';
    const description = data?.product?.description?.slice(0, 155) || 'Explore this product on WACCA.';
    return [
        { title },
        { name: 'description', content: description },
    ];
};

/**
 * @param {import('@remix-run/server-runtime').LoaderFunctionArgs} args
 */
export async function loader({ params }) {
    const { handle } = params;
    const product = WACCA_PRODUCTS.find(p => p.handle === handle);

    if (!product) {
        throw new Response('Product not found', { status: 404 });
    }

    // Default mock locale since we removed Hydrogen context
    const locale = { currency: 'USD' };
    return { product, usdProduct: null, locale };
}

export default function ProductPage() {
    const { product, usdProduct, locale } = useLoaderData();
    const [whatsUr20, setWhatsUr20] = useState('');
    const [whatsUr20Error, setWhatsUr20Error] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(
        product.variants?.nodes?.[0] || null
    );

    const handleWhatsUr20Change = (val) => {
        setWhatsUr20(val);
        if (val.trim()) {
            setWhatsUr20Error('');
        }
    };

    const firstImage = product.images?.nodes?.[0];
    const isAvailable = product.availableForSale;
    const localPrice = product.priceRange.minVariantPrice;
    const localCompareAt = product.compareAtPrice;

    // Retrieve corresponding USD variant explicitly
    const usdVariant = usdProduct?.variants?.nodes?.find(v => v.id === selectedVariant?.id);
    const usdPrice = usdVariant?.price;

    // We only display dual currency if the local currency isn't already USD
    const isDualCurrency = locale.currency !== 'USD' && usdPrice;

    return (
        <main className="min-h-screen bg-wacca-darker relative overflow-hidden pt-[env(safe-area-inset-top)] selection:bg-wacca-red selection:text-white">
            {/* 3D Background */}
            <ClientOnlyBackgroundCity opacity={0.15} />

            {/* ─── Back to Network Navigation ─── */}
            <div className="relative z-10 px-6 pt-24 pb-8 flex items-center">
                <Link to="/" className="group flex items-center gap-4 text-wacca-muted hover:text-white transition-colors duration-300">
                    <div className="relative flex items-center justify-center w-6 h-6">
                        {/* Ripple Effect Ring */}
                        <div className="absolute inset-0 rounded-full border border-current opacity-60 group-hover:scale-[2.0] group-hover:opacity-0 transition-all duration-[800ms] ease-out" />
                        {/* Core Circle */}
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    </div>
                    <span className="font-display text-xs tracking-[0.2em] uppercase">
                        Back to Network
                    </span>
                </Link>
            </div>

            {/* ─── Product Content ─── */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12 pb-32">
                {/* Image Section */}
                <div style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: '#0a0a0f',
                    marginBottom: 24,
                    border: '1px solid #1e1e2e',
                }}>
                    {product.handle === 'angr-kun-main' ? (
                        <img 
                            src={angrKunImage} 
                            alt="WACCA Angr-kun Pro Angle" 
                            className="product-main-image w-full h-auto object-cover border border-[#00ff41]/20 shadow-[0_0_30px_rgba(0,255,65,0.15)]"
                        />
                    ) : firstImage ? (
                        <Image
                            data={firstImage}
                            sizes="(min-width: 768px) 50vw, 100vw"
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '50vh',
                                objectFit: 'cover',
                                display: 'block',
                            }}
                        />
                    ) : (
                        <div style={{ padding: '100px 20px', textAlign: 'center', color: '#8B8B9E' }}>
                            [ NO VISUAL DATA ]
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div style={{ marginBottom: 32 }}>
                    <h1 className="font-display text-3xl md:text-5xl font-bold tracking-wide text-white mb-4">
                        {product.title}
                    </h1>

                    {/* Dual Currency Price Display */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        marginBottom: 16,
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderLeft: '4px solid #fff',
                        padding: '12px 16px',
                        borderRadius: '0 8px 8px 0',
                    }}>
                        {/* Local Price (Primary) */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                            {localPrice && (
                                <span style={{
                                    fontFamily: 'monospace',
                                    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                                    fontWeight: 700,
                                    color: '#fff',
                                }}>
                                    <Money data={localPrice} />
                                </span>
                            )}
                            {localCompareAt && (
                                <span style={{ fontSize: 14, color: '#8B8B9E', textDecoration: 'line-through' }}>
                                    <Money data={localCompareAt} />
                                </span>
                            )}
                        </div>

                        {/* USD Equiv (Secondary) */}
                        {isDualCurrency && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{
                                    fontFamily: 'monospace',
                                    fontSize: 14,
                                    color: '#8B8B9E',
                                }}>
                                    REF_VALUE_USD:
                                </span>
                                <span style={{
                                    fontFamily: 'monospace',
                                    fontSize: 14,
                                    color: '#fff',
                                }}>
                                    <Money data={usdPrice} />
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {product.description && (
                        <p style={{
                            color: '#8B8B9E',
                            fontSize: 14,
                            lineHeight: 1.8,
                            margin: '0 0 24px',
                            fontFamily: '"Noto Sans JP", sans-serif',
                        }}>
                            {product.description}
                        </p>
                    )}

                    {/* Variant selector */}
                    {product.variants?.nodes?.length > 1 && (
                        <div style={{ marginBottom: 24 }}>
                            <label style={{
                                display: 'block',
                                fontFamily: 'monospace',
                                fontSize: 11,
                                color: '#00ffff',
                                marginBottom: 12,
                            }}>
                                [ SELECT_VARIANT ]
                            </label>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {product.variants.nodes.map((variant) => (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant)}
                                        style={{
                                            padding: '8px 16px',
                                            border: `1px solid ${selectedVariant?.id === variant.id ? '#fff' : '#333'}`,
                                            background: selectedVariant?.id === variant.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                                            color: selectedVariant?.id === variant.id ? '#fff' : '#8B8B9E',
                                            fontFamily: '"Noto Sans JP", sans-serif',
                                            fontSize: 13,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {variant.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── Purchase Section ─── */}
                <div style={{
                    padding: '24px',
                    border: '1px solid #1e1e2e',
                    background: '#0a0a0f',
                    borderRadius: 12,
                }}>
                    {!isAvailable ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '20px',
                            border: '1px dashed #E63946',
                            background: 'rgba(230, 57, 70, 0.1)',
                            color: '#E63946',
                            fontFamily: 'monospace',
                            fontSize: 18,
                            fontWeight: 700,
                            letterSpacing: '0.1em'
                        }}>
                            [ SOLD OUT ]
                        </div>
                    ) : (
                        <>
                            <div onClick={() => {
                                if (!whatsUr20.trim()) setWhatsUr20Error("[ ERR: LOCATION UNKNOWN ]");
                            }}>
                                <WhatsUr20Input
                                    value={whatsUr20}
                                    onChange={handleWhatsUr20Change}
                                    error={whatsUr20Error}
                                />
                            </div>

                            {product.stripePriceId && (
                                <CheckoutButton
                                    variantId={product.stripePriceId}
                                    productHandle={product.handle}
                                    whatsUr20={whatsUr20}
                                    disabled={!whatsUr20.trim()}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}


