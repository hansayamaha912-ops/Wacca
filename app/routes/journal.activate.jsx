import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from '@remix-run/react';
import { useSync } from '~/lib/SyncContext';

export const meta = () => [
    { title: 'DIGITAL STAMP ACTIVATION | WACCA' },
    { name: 'description', content: 'Activate your digital stamp. Become part of the WACCA network.' },
];

/**
 * Generates a pseudo-unique stamp hash for the user session.
 */
function generateStampHash() {
    const chars = 'ABCDEF0123456789';
    const segments = [4, 8, 4];
    return segments
        .map((len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join(''))
        .join('-');
}

/**
 * Digital Stamp route — /journal/activate
 *
 * When a user arrives at this page, a "digital stamp" is generated and stored
 * in localStorage. This stamp acts as a persistent proof that the user has
 * interfaced with the WACCA system. Stamps can later be referenced across
 * the site to unlock hidden UI elements or personalized content.
 *
 * On activation, SyncContext is triggered — causing the site-wide glitch
 * flash and HeroScene burst effect to fire globally.
 */
export default function JournalActivate() {
    const [searchParams] = useSearchParams();
    const [phase, setPhase] = useState('INIT'); // INIT → SCANNING → STAMPED
    const [stampData, setStampData] = useState(null);
    const [alreadyStamped, setAlreadyStamped] = useState(false);
    const [terminalLines, setTerminalLines] = useState([]);
    const [showNodeBanner, setShowNodeBanner] = useState(false);
    const terminalRef = useRef(null);
    const bannerRef = useRef(null);

    const { setSynchronized } = useSync();

    useEffect(() => {
        // Check existing stamp
        const existing = localStorage.getItem('wacca_stamp');
        if (existing) {
            try {
                const parsed = JSON.parse(existing);
                setStampData(parsed);
                setAlreadyStamped(true);
                setPhase('STAMPED');
                setTerminalLines([
                    '> STAMP ALREADY EXISTS IN LOCAL MATRIX.',
                    `> HASH: ${parsed.hash}`,
                    `> ACTIVATED: ${parsed.activatedAt}`,
                    `> ORIGIN: ${parsed.origin || 'DIRECT'}`,
                    '> STATUS: VALID ✓',
                    '',
                    '>> NO RE-ACTIVATION REQUIRED.',
                ]);
                return;
            } catch {
                localStorage.removeItem('wacca_stamp');
            }
        }

        // Begin activation sequence
        const origin = searchParams.get('origin') || 'DIRECT_ACCESS';
        const hash = generateStampHash();
        const now = new Date().toISOString();
        const lines = [
            '> INITIATING STAMP PROTOCOL...',
            '> SCANNING NEURAL INTERFACE...',
            `> ORIGIN VECTOR: ${origin.toUpperCase()}`,
            '> GENERATING CRYPTOGRAPHIC HASH...',
            `> HASH: ${hash}`,
            '> EMBEDDING IN LOCAL MATRIX...',
            '> VERIFYING STRUCTURAL INTEGRITY...',
            '> SYNCHRONIZING WITH WACCA NETWORK...',
            '> STATUS: COMPLETE ✓',
            '',
            '>> DIGITAL STAMP ACTIVATED.',
            '>> NEW NODE ONLINE.',
        ];

        let lineIndex = 0;
        setPhase('SCANNING');

        const interval = setInterval(() => {
            if (lineIndex < lines.length) {
                setTerminalLines((prev) => [...prev, lines[lineIndex]]);
                lineIndex++;
            } else {
                clearInterval(interval);
                const stamp = {
                    hash,
                    activatedAt: now,
                    origin: origin.toUpperCase(),
                    version: '1.0',
                };
                localStorage.setItem('wacca_stamp', JSON.stringify(stamp));
                setStampData(stamp);
                setPhase('STAMPED');

                // Fire the site-wide sync glitch effect via SyncContext
                setSynchronized(origin.toUpperCase());

                // Trigger the NEW NODE ACTIVATED banner after a beat
                setTimeout(() => setShowNodeBanner(true), 400);
            }
        }, 280);

        return () => clearInterval(interval);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Auto-scroll terminal
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalLines]);

    // Banner pulse animation (CSS-in-JS for the keyframes)
    const bannerKeyframes = `
        @keyframes nodeActivatedSlideIn {
            0% { transform: translateY(-30px) scale(0.9); opacity: 0; }
            60% { transform: translateY(4px) scale(1.02); opacity: 1; }
            100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes nodePulseRing {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes nodeGlowPulse {
            0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 204, 0.2), inset 0 0 20px rgba(0, 255, 204, 0.05); }
            50% { box-shadow: 0 0 40px rgba(0, 255, 204, 0.4), inset 0 0 30px rgba(0, 255, 204, 0.1); }
        }
    `;

    return (
        <main className="min-h-screen bg-wacca-darker text-white pt-32 pb-48 px-6 md:px-12 flex flex-col items-center justify-center selection:bg-cyan-500 selection:text-white">
            <style>{bannerKeyframes}</style>
            <div className="max-w-2xl w-full relative z-10">
                {/* Header */}
                <header className="mb-12 border-b border-wacca-border/50 pb-8 text-center">
                    <h1 className="font-display text-3xl md:text-5xl tracking-widest uppercase mb-4">
                        {phase === 'STAMPED' ? (
                            <>
                                <span className="text-cyan-400 animate-[pulse_2s_infinite]">Stamp Activated.</span>
                                <br />
                                <span className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                                    {alreadyStamped ? 'Already Verified.' : 'Welcome.'}
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="text-wacca-red animate-pulse">Activating</span>
                                <span className="text-white">...</span>
                            </>
                        )}
                    </h1>
                    <div className="font-mono text-xs text-wacca-muted tracking-widest">
                        [ STAMP PROTOCOL v1.0 ]
                    </div>
                </header>

                {/* ─── NEW NODE ACTIVATED Banner ─── */}
                {showNodeBanner && !alreadyStamped && (
                    <div
                        ref={bannerRef}
                        className="mb-8 border border-cyan-400/40 bg-[#040812] rounded-lg p-5 text-center relative overflow-hidden"
                        style={{
                            animation: 'nodeActivatedSlideIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards, nodeGlowPulse 2s ease-in-out infinite 0.6s',
                        }}
                    >
                        {/* Animated pulse ring behind the icon */}
                        <div className="flex justify-center mb-3">
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                <div
                                    className="absolute inset-0 rounded-full border-2 border-cyan-400"
                                    style={{ animation: 'nodePulseRing 1.5s ease-out infinite' }}
                                />
                                <div
                                    className="absolute inset-0 rounded-full border-2 border-cyan-400"
                                    style={{ animation: 'nodePulseRing 1.5s ease-out infinite 0.5s' }}
                                />
                                <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(0,255,204,0.8)]" />
                            </div>
                        </div>
                        <div className="font-display text-lg md:text-xl tracking-[0.25em] uppercase text-cyan-400 font-bold mb-1">
                            New Node Activated
                        </div>
                        <div className="font-mono text-[10px] text-cyan-400/50 tracking-widest">
                            SYSTEM SYNCHRONIZED • WACCA NETWORK EXPANDED
                        </div>
                    </div>
                )}

                {/* Terminal display */}
                <div
                    ref={terminalRef}
                    className="bg-[#030305] border border-cyan-400/20 p-6 md:p-10 rounded-md font-mono text-[#00ffcc] text-sm leading-8 min-h-[320px] max-h-[420px] overflow-y-auto shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] relative"
                >
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,204,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
                    {terminalLines.map((line, i) => (
                        <div key={i} className={`whitespace-pre ${line === '' ? 'h-4' : ''}`}>
                            {line}
                        </div>
                    ))}
                    {phase !== 'STAMPED' && (
                        <span className="animate-pulse mix-blend-screen text-white bg-cyan-400 w-2 h-4 inline-block ml-1 align-middle opacity-80" />
                    )}
                </div>

                {/* Stamp badge — only visible after completion */}
                {phase === 'STAMPED' && stampData && (
                    <div className="mt-8 border border-wacca-border/30 bg-[#080810] rounded-lg p-6 text-center animate-[fadeIn_0.6s_ease-out]">
                        <div className="font-mono text-xs text-wacca-muted tracking-widest mb-3">YOUR DIGITAL STAMP</div>
                        <div className="font-display text-2xl md:text-3xl tracking-[0.2em] text-cyan-400 mb-2">
                            {stampData.hash}
                        </div>
                        <div className="font-mono text-[10px] text-wacca-muted space-y-1">
                            <p>ACTIVATED: {new Date(stampData.activatedAt).toLocaleString('ja-JP')}</p>
                            <p>ORIGIN: {stampData.origin}</p>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="mt-12 flex justify-center gap-8">
                    <Link
                        to="/journal"
                        className="group flex items-center gap-3 text-wacca-muted hover:text-white transition-colors duration-300"
                    >
                        <span className="font-display text-xs tracking-[0.2em] uppercase">← Journal</span>
                    </Link>
                    <Link
                        to="/"
                        className="group flex items-center gap-3 text-wacca-muted hover:text-white transition-colors duration-300"
                    >
                        <div className="relative flex items-center justify-center w-5 h-5">
                            <div className="absolute inset-0 rounded-full border border-current opacity-60 group-hover:scale-[2.0] group-hover:opacity-0 transition-all duration-[800ms] ease-out" />
                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                        </div>
                        <span className="font-display text-xs tracking-[0.2em] uppercase">Core</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}
