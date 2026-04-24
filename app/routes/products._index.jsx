import { useLoaderData, Link } from '@remix-run/react';
import { Image, Money } from '@shopify/hydrogen';
import { useEffect, useRef } from 'react';
import { WACCA_PRODUCTS } from '~/constants/products';
import angrKunImage from '~/assets/images/products/angr-kun-pro.jpg';

export const meta = () => {
    return [{ title: 'ARCHIVE | WACCA' }];
};

export async function loader() {
    return { products: WACCA_PRODUCTS };
}

function FadeInItem({ children }) {
    const ref = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-12');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="opacity-0 translate-y-12 transition-all duration-[1200ms] ease-out">
            {children}
        </div>
    );
}

export default function ProductsIndex() {
    const { products } = useLoaderData();

    return (
        <main className="min-h-screen bg-wacca-darker text-white pt-32 pb-48 px-6 md:px-12 selection:bg-wacca-red selection:text-white">
            <header className="max-w-screen-2xl mx-auto mb-32 border-b border-wacca-border pb-12">
                <h1 className="font-display text-5xl md:text-7xl font-bold tracking-[0.15em] uppercase mb-4">
                    Archive
                </h1>
                <div className="font-mono text-wacca-muted text-xs tracking-widest flex items-center gap-4">
                    <span className="w-2 h-2 rounded-full bg-wacca-red animate-pulse" />
                    [ RECORDED_OBJECTS: {products.length} ]
                </div>
            </header>

            <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-32">
                {products.map((product, index) => {
                    const firstImage = product.images?.nodes?.[0];
                    // Generate pseudo-coordinates for structural aesthetic
                    const pseudoLat = (35.6895 - (index * 0.123)).toFixed(4);
                    const pseudoLng = (139.6917 + (index * 0.234)).toFixed(4);
                    const hashId = product.id.split('/').pop().substring(0, 8);

                    return (
                        <FadeInItem key={product.id}>
                            <Link to={`/products/${product.handle}`} className="group block">
                                <div className="mb-6 overflow-hidden rounded-xl bg-black border border-wacca-border relative">
                                    {product.handle === 'angr-kun-main' ? (
                                        <img 
                                            src={angrKunImage} 
                                            alt="WACCA Angr-kun Pro Angle" 
                                            className="w-full h-auto aspect-[4/5] object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-[800ms] ease-out"
                                        />
                                    ) : firstImage ? (
                                        <Image
                                            data={firstImage}
                                            sizes="(min-width: 768px) 50vw, 100vw"
                                            className="w-full h-auto aspect-[4/5] object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-[800ms] ease-out"
                                        />
                                    ) : (
                                        <div className="w-full aspect-[4/5] bg-[#0a0a0f] flex items-center justify-center text-wacca-muted font-mono text-sm">
                                            [ NO_VISUAL_DATA ]
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 px-2">
                                    <div className="flex justify-between items-baseline border-b border-wacca-border/50 pb-4">
                                        <h2 className="font-display text-xl md:text-2xl tracking-[0.1em] group-hover:text-wacca-red transition-colors duration-300">
                                            {product.title}
                                        </h2>
                                        <span className="font-mono text-sm text-wacca-muted group-hover:text-white transition-colors duration-300">
                                            <Money data={product.priceRange.minVariantPrice} />
                                        </span>
                                    </div>
                                    <div className="font-mono text-[10px] text-[#555] tracking-widest flex justify-between mt-2">
                                        <span>SYS.ID: {hashId}</span>
                                        <span>LOC: {pseudoLat}° N, {pseudoLng}° E</span>
                                    </div>
                                </div>
                            </Link>
                        </FadeInItem>
                    );
                })}
            </div>
        </main>
    );
}


