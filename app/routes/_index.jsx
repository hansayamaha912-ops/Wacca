import { useState, useEffect, Suspense } from 'react';
import { Link } from '@remix-run/react';
import { useSync } from '~/lib/SyncContext';

function GlitchOverlay() {
    const { isSynchronized, syncedCity } = useSync();
    const [active, setActive] = useState(false);
    const [scrambled, setScrambled] = useState('');

    useEffect(() => {
        if (isSynchronized) {
            setActive(true);
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
            let iteration = 0;
            const target = `SYNCING WITH ${syncedCity}...`;

            const interval = setInterval(() => {
                setScrambled(target.split('').map((char, index) => {
                    if (index < iteration) {
                        return target[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join(''));

                if (iteration >= target.length) {
                    clearInterval(interval);
                    setTimeout(() => setActive(false), 800);
                }
                iteration += 1 / 3;
            }, 30);

            return () => clearInterval(interval);
        }
    }, [isSynchronized, syncedCity]);

    if (!active) return null;

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center mix-blend-difference">
            <style>{`
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100vh); }
                }
                .glitch-scan {
                    animation: scanline 0.8s linear infinite;
                }
            `}</style>

            {/* Dark overlay with slight opacity flash */}
            <div className="absolute inset-0 bg-white/5 animate-[pulse_0.1s_ease-in-out_infinite]" />

            {/* Scanline */}
            <div className="absolute inset-0 w-full h-[10vh] bg-white/10 glitch-scan backdrop-blur-md" />

            {/* Hacker typography */}
            <h1 className="text-4xl md:text-6xl font-mono text-white tracking-widest font-bold z-10 p-8 border border-white/20 bg-black/50 backdrop-blur-sm">
                {scrambled}
            </h1>
        </div>
    );
}

/**
 * @type {import('@remix-run/server-runtime').MetaFunction}
 */
export const meta = () => {
    return [
        { title: 'WACCA - Your City. Your Culture.' },
        { name: 'description', content: 'From Tokyo to Far, our products carry the energy of every city they touch.' },
    ];
};

/**
 * Client-only R3F component loader.
 * Uses useEffect + dynamic import to completely avoid server-side evaluation of R3F.
 */
function ClientOnlyHeroScene() {
    const [HeroScene, setHeroScene] = useState(null);

    useEffect(() => {
        import('~/components/3d/HeroScene').then((mod) => {
            setHeroScene(() => mod.default);
        });
    }, []);

    if (!HeroScene) {
        return (
            <div className="hero-canvas-container fixed inset-0 z-0" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#050508',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="animate-pulse-glow" style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #E63946, #FF6B6B)',
                        margin: '0 auto 16px',
                    }} />
                    <p style={{
                        color: '#8B8B9E',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '13px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                    }}>
                        Loading Experience...
                    </p>
                </div>
            </div>
        );
    }

    return <HeroScene />;
}

export default function Index() {
    return (
        <main>
            <GlitchOverlay />

            {/* ─── 3D Hero Section ─── */}
            <section id="hero-3d" style={{ position: 'relative', minHeight: '500vh' }}>
                <ClientOnlyHeroScene />

                {/* ─── Scroll overlay content ─── */}
                <div className="content-overlay" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    pointerEvents: 'none',
                    zIndex: 10
                }}>
                    {/* First viewport — Brand intro */}
                    <div className="flex flex-col items-center justify-end h-screen px-6 pb-[12vh] text-center pointer-events-none">
                        
                        <div className="flex flex-col items-center gap-10 md:gap-14 animate-fade-in-up pointer-events-none">
                            {/* Upper: Main Title */}
                            <h1 className="font-mono text-[#00ff41] pointer-events-none" style={{
                                fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
                                fontWeight: 900,
                                letterSpacing: '0.02em',
                                lineHeight: 1.1,
                                textShadow: '0 0 20px rgba(0,255,65,0.5)',
                            }}>
                                Welcome to WACCA
                            </h1>

                            {/* Lower: Sub Message */}
                            <p className="font-mono text-[#b4f0b4] opacity-90 pointer-events-none" style={{
                                fontSize: 'clamp(1.7rem, 4.2vw, 4rem)', 
                                fontWeight: 300,
                                letterSpacing: '0.45em',
                            }}>
                                ur one of us.
                            </p>
                        </div>

                        {/* System Status Label */}
                        <p className="animate-fade-in-up font-mono" style={{
                            fontSize: 'clamp(10px, 2vw, 12px)',
                            color: '#00ff41',
                            letterSpacing: '0.5em',
                            textTransform: 'uppercase',
                            marginTop: '4rem',
                            animationDelay: '0.2s',
                            opacity: 0,
                            pointerEvents: 'none',
                        }}>
                            SYSTEM AWAKENING
                        </p>

                        <div className="animate-fade-in-up" style={{
                            marginTop: 24,
                            animationDelay: '0.5s',
                            opacity: 0,
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4 }}>
                                <path d="M12 5v14M5 12l7 7 7-7" stroke="#00ff41" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    {/* Second viewport — tagline */}
                    <div style={{
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 24px',
                        textAlign: 'center',
                        pointerEvents: 'none',
                    }}>
                        <p className="font-mono" style={{
                            fontSize: 'clamp(1.2rem, 4vw, 2.2rem)',
                            fontWeight: 300,
                            color: '#b4f0b4',
                            lineHeight: 1.5,
                            maxWidth: 600,
                            pointerEvents: 'none',
                            textShadow: '0 0 8px rgba(180,240,180,0.4)',
                        }}>
                            What's ur twenty?
                        </p>
                    </div>

                    {/* Third viewport — city reveal message */}
                    <div style={{
                        height: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 24px',
                        pointerEvents: 'none',
                    }}>
                        <div className="glass-card" style={{
                            padding: 'clamp(24px, 5vw, 48px)',
                            textAlign: 'center',
                            maxWidth: 440,
                            pointerEvents: 'none',
                        }}>
                            <h2 className="font-mono text-[#00ff41]" style={{
                                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                                fontWeight: 700,
                                margin: '0 0 12px',
                                pointerEvents: 'none',
                            }}>
                                NODE DISCOVERED
                            </h2>
                            <p className="font-mono" style={{
                                color: '#8B8B9E',
                                fontSize: '14px',
                                lineHeight: 1.7,
                                margin: 0,
                                pointerEvents: 'none',
                            }}>
                                From Based Japan, Tokyo to next location
                            </p>
                        </div>
                    </div>

                    {/* Fourth viewport — CTA */}
                    <div style={{
                        height: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 24px',
                        pointerEvents: 'none', // Top container is none
                    }}>
                        <div style={{ textAlign: 'center', pointerEvents: 'auto' }}>
                            <h2 style={{
                                fontFamily: 'Outfit, sans-serif',
                                fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                                fontWeight: 800,
                                margin: '0 0 24px',
                                background: 'linear-gradient(135deg, #E63946, #FF6B6B)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                Explore Collection
                            </h2>
                            <Link
                                to="/products/angr-kun-main"
                                className="btn-wacca"
                                style={{ textDecoration: 'none' }}
                            >
                                Shop Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
