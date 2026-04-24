import { useState } from 'react';
import { Link } from '@remix-run/react';
import { useSync } from '~/lib/SyncContext';
import { ClientOnly } from '~/components/ui/ClientOnly';

export function GlobalNavigation() {
    const { isSynchronized } = useSync();
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Cyber hover effects triggered when System is Synchronized
    const syncClasses = isSynchronized
        ? "hover:text-cyan-400 hover:drop-shadow-[0_0_8px_#00ffff] hover:animate-[pulse_0.5s_infinite] transition-all duration-300"
        : "hover:text-wacca-red transition-all duration-300";

    const LINKS = [
        { name: 'HOME', to: '/' },
        { name: 'OBJECTS', to: '/products/angr-kun-main' },
        { name: 'ABOUT', to: '/about' },
        { name: 'ACCOUNT', to: '/account/login' },
    ];

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-wacca-darker/80 backdrop-blur-md border-b border-wacca-border">
            <div className="max-w-screen-2xl mx-auto px-6 h-24 flex items-center justify-between pt-2">
                {/* Logo Area */}
                <Link to="/" className={`group flex items-center gap-2`} onClick={() => setDrawerOpen(false)}>
                    <ClientOnly fallback={<div style={{ height: '60px', width: '180px' }}></div>}>
                        <img 
                            src="/logo-wacca-transparent.png" 
                            alt="WACCA"
                            className="transition-all duration-300"
                            style={{ 
                                height: '60px', // Scaled up 1.5x from 40px
                                objectFit: 'contain',
                                imageRendering: 'auto',
                                // Enforce Screen blend to completely drop the black square frame
                                mixBlendMode: 'screen',
                                filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.2))'
                            }}
                            onMouseEnter={(e) => e.target.style.filter = 'drop-shadow(0 0 2px rgba(0,255,65,0.4))'}
                            onMouseLeave={(e) => e.target.style.filter = 'drop-shadow(0 0 1px rgba(255,255,255,0.2))'}
                        />
                    </ClientOnly>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-10 items-center">
                    {LINKS.map(link => (
                        <Link key={link.name} to={link.to} className={`font-display text-base tracking-[0.25em] text-wacca-muted ${syncClasses}`}>
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Drawer Toggle */}
                <button
                    className={`md:hidden font-display text-xs tracking-widest text-wacca-muted border border-wacca-border px-3 py-1.5 rounded-full uppercase ${syncClasses}`}
                    onClick={() => setDrawerOpen(true)}
                >
                    NETWORK INDEX
                </button>
            </div>

            {/* Mobile Drawer Fullscreen Overlay */}
            <div
                className={`fixed inset-0 bg-wacca-darker/95 backdrop-blur-xl z-[100] flex flex-col justify-center items-center transition-opacity duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            >
                <button
                    className="absolute top-5 right-6 font-display text-xs tracking-widest text-wacca-muted uppercase border border-wacca-border px-3 py-1.5 rounded-full"
                    onClick={() => setDrawerOpen(false)}
                >
                    CLOSE
                </button>
                <nav className="flex flex-col gap-10 text-center">
                    {LINKS.map(link => (
                        <Link
                            key={link.name}
                            to={link.to}
                            onClick={() => setDrawerOpen(false)}
                            className={`font-display text-2xl tracking-[0.3em] text-white ${syncClasses}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
