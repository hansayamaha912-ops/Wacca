import { Link } from '@remix-run/react';

export const meta = () => [
    { title: 'SIGNAL LOST | WACCA' },
    { name: 'description', content: 'The requested node coordinates do not exist within the current WACCA matrix.' },
];

export default function CatchAllRoute() {
    return (
        <main className="min-h-screen bg-wacca-darker flex flex-col justify-center items-center px-6 selection:bg-wacca-red selection:text-white relative overflow-hidden">
            {/* Background Glitch Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#111] via-wacca-darker to-wacca-darker opacity-80" />

            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="font-mono text-cyan-400 text-xs md:text-sm tracking-[0.3em] uppercase mb-4 animate-pulse">
                    [ SYS.ERR_404_DETECTED ]
                </div>
                <h1 className="font-display font-bold text-5xl md:text-8xl tracking-[0.1em] text-[#d1d1d8] mb-8 relative group">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-[#555]">
                        SIGNAL LOST
                    </span>
                    <span className="absolute -inset-1 blur-md bg-wacca-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </h1>
                <p className="font-sans text-[#888] max-w-md mx-auto leading-relaxed mb-12">
                    The requested node coordinates do not exist within the current matrix. Connection intercepted or structural anomaly detected.
                </p>
                <Link to="/" className="group flex items-center gap-4 text-wacca-muted hover:text-cyan-400 transition-colors duration-300 border border-wacca-border hover:border-cyan-400 px-6 py-3 rounded-md bg-black/50 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <span className="w-2 h-2 bg-wacca-red group-hover:bg-cyan-400 transition-colors duration-300 animate-pulse" />
                    <span className="font-mono text-xs tracking-[0.2em] uppercase">
                        Reconnect To Network
                    </span>
                </Link>
            </div>
        </main>
    );
}
