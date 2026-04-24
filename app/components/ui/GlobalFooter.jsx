import { Link } from '@remix-run/react';
import { useSync } from '~/lib/SyncContext';
import { ClientOnly } from '~/components/ui/ClientOnly';

export function GlobalFooter() {
    const { isSynchronized } = useSync();

    const borderStyle = isSynchronized ? 'border-cyan-400/50 drop-shadow-[0_0_8px_#00ffff]' : 'border-wacca-border';
    const textStyle = isSynchronized ? 'animate-[pulse_1s_infinite] text-cyan-200' : 'text-wacca-muted hover:text-white transition-colors';

    return (
        <footer className={`bg-black border-t ${borderStyle} pt-16 pb-32 px-6 md:px-12 transition-all duration-[2000ms] w-full mt-auto relative z-40`}>
            <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between gap-12">

                {/* Brand & Geo */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[10px] tracking-widest text-[#00ff41] animate-pulse">welcome to</span>
                        <Link to="/" className={`group flex items-center gap-2 ${isSynchronized ? 'drop-shadow-[0_0_12px_#00ffff]' : ''}`}>
                            <ClientOnly fallback={<div style={{ height: '3.5rem', width: '120px' }}></div>}>
                                <img 
                                    src="/logo-wacca-transparent.png" 
                                    alt="WACCA"
                                    className="transition-all duration-300"
                                    style={{ 
                                        height: '3.5rem', // ~56px for clear scale and legibility
                                        objectFit: 'contain',
                                        imageRendering: 'auto',
                                        mixBlendMode: 'screen',
                                        filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.2))'
                                    }}
                                    onMouseEnter={(e) => e.target.style.filter = 'drop-shadow(0 0 2px rgba(0,255,65,0.4))'}
                                    onMouseLeave={(e) => e.target.style.filter = 'drop-shadow(0 0 1px rgba(255,255,255,0.2))'}
                                />
                            </ClientOnly>
                        </Link>
                    </div>
                    <div className={`font-mono text-xs tracking-[0.2em] uppercase max-w-sm ${textStyle}`}>
                        <p>HEADQUARTERS / TOKYO, JP</p>
                        <p>35.6895° N, 139.6917° E</p>
                        <p className="mt-4">Engineering structural apparel for the global network grid.</p>
                    </div>
                </div>

                {/* Cyber-Links Matrix */}
                <div className="flex flex-wrap md:flex-nowrap gap-12 md:gap-24">
                    <div className="flex flex-col gap-4">
                        <h3 className="font-display text-sm tracking-widest text-[#555] uppercase">Navigation</h3>
                        <Link to="/products" className={`font-mono text-xs tracking-widest ${textStyle}`}>[ OBJECTS ]</Link>
                        <Link to="/journal" className={`font-mono text-xs tracking-widest ${textStyle}`}>[ JOURNAL ]</Link>
                        <Link to="/about" className={`font-mono text-xs tracking-widest ${textStyle}`}>[ ABOUT_US ]</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="font-display text-sm tracking-widest text-[#555] uppercase">System Legal</h3>
                        <Link to="/policies" className={`font-mono text-xs tracking-widest ${textStyle}`}>[ REC_TOKUSHOHO ]</Link>
                        <Link to="/terms-of-service" className={`font-mono text-xs tracking-widest ${textStyle}`}>[ TERMS_OF_SVC ]</Link>
                        <Link to="/privacy-policy" className={`font-mono text-xs tracking-widest ${textStyle}`}>[ PRIVACY_PROT ]</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="font-display text-sm tracking-widest text-[#555] uppercase">Comm Channels</h3>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className={`font-mono text-xs tracking-widest ${textStyle}`}>[ INSTAGRAM ]</a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className={`font-mono text-xs tracking-widest ${textStyle}`}>[ X / TWITTER ]</a>
                    </div>
                </div>
            </div>

            <div className="max-w-screen-2xl mx-auto mt-24 border-t border-wacca-border/40 pt-8 flex justify-between items-center text-[#444] font-mono text-[10px] tracking-widest">
                <p>&copy; {new Date().getFullYear()} WACCA TOKYO. ALL SYSTEMS VERIFIED.</p>
                <p>STATUS: ONLINE</p>
            </div>
        </footer>
    );
}
