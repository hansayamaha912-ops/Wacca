import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Link, useSearchParams } from '@remix-run/react';
import { useSync } from '~/lib/SyncContext';

export const meta = () => [
    { title: 'NODE CONNECTED | WACCA' },
    { name: 'description', content: 'Order synchronization successful.' },
];

/**
 * 時差式覚醒モード (Time-delayed Awakening Mode)
 *
 * When `?mode=delivered` is present, the page transitions from
 * "awaiting manufacture" to a full "delivery confirmation" UX
 * with gold particle effects and STATION: ARRIVED status display.
 */

const PHASE_AWAITING = 'awaiting';
const PHASE_DELIVERED = 'delivered';

function buildTerminalText(locationParam, phase) {
    if (phase === PHASE_DELIVERED) {
        return `> DELIVERY PROTOCOL ENGAGED.
> ORIGIN TERMINAL: ${locationParam.toUpperCase()}
> PAYMENT HASH VERIFIED.
> STRUCTURAL INTEGRITY VALID.
> MANUFACTURE: COMPLETE ✓
> SHIPMENT: DISPATCHED ✓
> STATUS: DELIVERED

>> STATION: ARRIVED
>> YOUR ARTIFACT HAS COMPLETED ITS JOURNEY.
>> THANK YOU FOR SYNCHRONIZING.
>> WACCA SYSTEMS OUT.`;
    }

    return `> INITIATING FULFILLMENT PROTOCOL...
> ORIGIN TERMINAL: ${locationParam.toUpperCase()}
> PAYMENT HASH VERIFIED.
> STRUCTURAL INTEGRITY VALID.
> STATUS: AWAITING_MANUFACTURE
> EST_TIMELINE: 2-4 WEEKS

>> SYNC SUCCESSFUL. WACCA SYSTEMS OUT.`;
}

/**
 * Gold Particle Canvas Effect — rendered behind the terminal in delivered mode.
 * Creates floating golden particles with gentle drift and fade.
 */
function GoldParticleCanvas() {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animRef = useRef(null);

    const initParticles = useCallback(() => {
        const particles = [];
        for (let i = 0; i < 80; i++) {
            particles.push({
                x: Math.random(),
                y: Math.random(),
                size: 1.5 + Math.random() * 3,
                speedX: (Math.random() - 0.5) * 0.0008,
                speedY: -0.0003 - Math.random() * 0.001,
                opacity: 0.2 + Math.random() * 0.6,
                // Gold color variations: warm gold → amber → pale gold
                hue: 38 + Math.random() * 15,
                sat: 70 + Math.random() * 30,
                light: 50 + Math.random() * 20,
                phase: Math.random() * Math.PI * 2,
            });
        }
        return particles;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function resize() {
            const dpr = Math.min(window.devicePixelRatio, 2);
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        }
        resize();
        window.addEventListener('resize', resize);

        particlesRef.current = initParticles();
        let time = 0;

        function draw() {
            const rect = canvas.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            ctx.clearRect(0, 0, w, h);
            time += 0.016;

            particlesRef.current.forEach((p) => {
                // Gentle sinusoidal drift
                p.x += p.speedX + Math.sin(time * 0.5 + p.phase) * 0.0002;
                p.y += p.speedY;

                // Wrap around
                if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
                if (p.x < -0.05) p.x = 1.05;
                if (p.x > 1.05) p.x = -0.05;

                const px = p.x * w;
                const py = p.y * h;
                const flickerOpacity = p.opacity * (0.7 + 0.3 * Math.sin(time * 2 + p.phase));

                // Glow layer
                const gradient = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3);
                gradient.addColorStop(0, `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${flickerOpacity * 0.3})`);
                gradient.addColorStop(1, `hsla(${p.hue}, ${p.sat}%, ${p.light}%, 0)`);
                ctx.fillStyle = gradient;
                ctx.fillRect(px - p.size * 3, py - p.size * 3, p.size * 6, p.size * 6);

                // Core dot
                ctx.beginPath();
                ctx.arc(px, py, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${flickerOpacity})`;
                ctx.fill();
            });

            animRef.current = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener('resize', resize);
        };
    }, [initParticles]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.7 }}
        />
    );
}

export default function OrderStatus() {
    const [searchParams] = useSearchParams();
    const locationParam = searchParams.get('location') || 'UNKNOWN_NODE';
    const modeParam = searchParams.get('mode');

    const phase = modeParam === 'delivered' ? PHASE_DELIVERED : PHASE_AWAITING;

    const { setSynchronized } = useSync();

    // Auto sync on mount overriding local storage delays
    useEffect(() => {
        if (locationParam && locationParam !== 'UNKNOWN_NODE') {
            // Slight delay so the user realizes the page loaded before the glitch hits
            const timer = setTimeout(() => {
                setSynchronized(locationParam);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [locationParam, setSynchronized]);

    // Hacker terminal typewriter effect state
    const fullText = useMemo(() => buildTerminalText(locationParam, phase), [locationParam, phase]);
    const [typedText, setTypedText] = useState('');

    useEffect(() => {
        let currentIndex = 0;
        setTypedText('');
        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setTypedText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 35);
        return () => clearInterval(interval);
    }, [fullText]);

    // Delivered phase: additional visual state
    const isDelivered = phase === PHASE_DELIVERED;

    // CSS keyframes for delivered mode
    const deliveredKeyframes = `
        @keyframes stationArrivedPulse {
            0%, 100% { text-shadow: 0 0 10px rgba(212, 175, 55, 0.4), 0 0 30px rgba(212, 175, 55, 0.1); }
            50% { text-shadow: 0 0 20px rgba(212, 175, 55, 0.8), 0 0 60px rgba(212, 175, 55, 0.3); }
        }
        @keyframes goldBorderShimmer {
            0% { border-color: rgba(212, 175, 55, 0.2); }
            50% { border-color: rgba(212, 175, 55, 0.5); }
            100% { border-color: rgba(212, 175, 55, 0.2); }
        }
    `;

    return (
        <main className="min-h-screen bg-wacca-darker pt-32 pb-48 px-6 md:px-12 flex flex-col items-center justify-center selection:bg-cyan-500 selection:text-white">
            {isDelivered && <style>{deliveredKeyframes}</style>}
            <div className="max-w-2xl w-full relative z-10">
                {/* Gold particle layer — delivered mode only */}
                {isDelivered && (
                    <div className="fixed inset-0 z-0 pointer-events-none">
                        <GoldParticleCanvas />
                    </div>
                )}

                <header className="mb-12 border-b border-wacca-border/50 pb-8 text-center relative z-10">
                    <h1 className="font-display text-4xl md:text-5xl tracking-widest uppercase mb-4">
                        {isDelivered ? (
                            <>
                                <span
                                    className="text-[#d4af37]"
                                    style={{ animation: 'stationArrivedPulse 2s ease-in-out infinite' }}
                                >
                                    Station: Arrived.
                                </span>
                                <br />
                                <span className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">Welcome Back.</span>
                            </>
                        ) : (
                            <>
                                <span className="text-cyan-400 animate-[pulse_2s_infinite]">Node Connected.</span>
                                <br />
                                <span className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">Thank You.</span>
                            </>
                        )}
                    </h1>
                    <div className="font-mono text-xs text-wacca-muted tracking-widest">
                        {isDelivered
                            ? '[ DELIVERY CONFIRMED — AWAKENING MODE ]'
                            : '[ SYSTEM ALIGNMENT CONFIRMED ]'}
                    </div>
                </header>

                <div
                    className={`relative overflow-hidden bg-[#030305] border ${
                        isDelivered ? 'border-[#d4af37]/30' : 'border-cyan-400/20'
                    } p-6 md:p-10 rounded-md font-mono text-sm leading-8 whitespace-pre min-h-[300px] shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] z-10 ${
                        isDelivered ? 'text-[#d4af37]' : 'text-[#00ffcc]'
                    }`}
                    style={isDelivered ? { animation: 'goldBorderShimmer 3s ease-in-out infinite' } : undefined}
                >
                    <div
                        className={`absolute inset-0 bg-[linear-gradient(${
                            isDelivered
                                ? 'rgba(212,175,55,0.03)'
                                : 'rgba(0,255,204,0.03)'
                        }_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none`}
                    />
                    {typedText}
                    <span className={`animate-pulse mix-blend-screen text-white ${isDelivered ? 'bg-[#d4af37]' : 'bg-cyan-400'} w-2 h-4 inline-block ml-1 align-middle opacity-80`} />
                </div>

                {/* Delivered-mode STATION: ARRIVED info card */}
                {isDelivered && (
                    <div
                        className="mt-8 border bg-[#0d0b06] rounded-lg p-6 text-center relative z-10 overflow-hidden"
                        style={{ animation: 'goldBorderShimmer 3s ease-in-out infinite', borderColor: 'rgba(212, 175, 55, 0.3)' }}
                    >
                        {/* Subtle gold shimmer line */}
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
                        <div className="font-mono text-xs text-[#d4af37]/60 tracking-widest mb-2">
                            STATION: ARRIVED — 覚醒完了
                        </div>
                        <div className="font-display text-lg tracking-[0.15em] text-[#d4af37]">
                            Your artifact has completed its journey.
                        </div>
                        <p className="mt-3 font-mono text-[10px] text-wacca-muted">
                            NODE: {locationParam.toUpperCase()} • MODE: DELIVERED • STATUS: AWAKENED
                        </p>
                    </div>
                )}

                <div className="mt-12 flex justify-center relative z-10">
                    <Link to="/" className="group flex items-center gap-4 text-wacca-muted hover:text-white transition-colors duration-300">
                        <div className="relative flex items-center justify-center w-6 h-6">
                            <div className="absolute inset-0 rounded-full border border-current opacity-60 group-hover:scale-[2.0] group-hover:opacity-0 transition-all duration-[800ms] ease-out" />
                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        </div>
                        <span className="font-display text-xs tracking-[0.2em] uppercase">
                            Return To Network Core
                        </span>
                    </Link>
                </div>
            </div>
        </main>
    );
}
