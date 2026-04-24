export const meta = () => [{ title: 'JOURNAL | WACCA' }];

const MOCK_ENTRIES = [
    {
        id: 'JNL-001',
        title: 'PHASE 01: THE AWAKENING',
        date: '2026.04.18',
        coords: '35.6895° N, 139.6917° E',
        body: 'The initial concept of WACCA was born in the neon-drenched alleys of Shibuya. We constructed our structural philosophy around the dichotomy of concrete permanence and digital ephemerality. Objects are not just physical; they are anchor points in a vast network designed to survive the modern overload.',
        hasImage: false
    },
    {
        id: 'JNL-002',
        title: 'MATERIAL SELECTION: FORGED IN DARKNESS',
        date: '2026.04.15',
        coords: '37.5665° N, 126.9780° E',
        body: 'Sourcing the absolute darkest fabrics to absorb ambient light. The objective is to create a void, a wearable black hole that grounds the user while everything else glitches around them. Heavy industrial hardware ensures a mechanical reliability unseen in contemporary architecture.',
        hasImage: false
    }
];

export default function JournalIndex() {
    return (
        <main className="min-h-screen bg-wacca-darker text-white pt-32 pb-48 px-6 md:px-12 selection:bg-cyan-500 selection:text-white">
            <header className="max-w-screen-xl mx-auto mb-24 border-b border-wacca-border pb-8">
                <h1 className="font-display text-5xl md:text-7xl font-bold tracking-[0.15em] uppercase mb-4">
                    Journal
                </h1>
                <div className="font-mono text-wacca-muted text-xs tracking-widest flex items-center gap-4">
                    <span className="w-2 h-2 rounded-full bg-wacca-red animate-pulse" />
                    [ SYS.LOGS_ACTIVE: {MOCK_ENTRIES.length} ]
                </div>
            </header>

            <div className="max-w-screen-xl mx-auto flex flex-col gap-32">
                {MOCK_ENTRIES.map(entry => (
                    <article key={entry.id} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 group">
                        {/* Meta Column */}
                        <div className="md:col-span-4 flex flex-col gap-4 border-t border-wacca-border/50 pt-4 mt-2">
                            <h2 className="font-display text-xl transition-colors duration-300 md:text-2xl tracking-[0.1em] text-white group-hover:text-cyan-400">
                                {entry.title}
                            </h2>
                            <div className="font-mono text-xs text-wacca-muted space-y-1">
                                <p>LOG.ID: {entry.id}</p>
                                <p>DATE: {entry.date}</p>
                                <p className="text-[#888] group-hover:text-white transition-colors duration-300">LOC: {entry.coords}</p>
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="md:col-span-8">
                            {entry.hasImage ? (
                                <div className="w-full aspect-[16/9] bg-black border border-wacca-border mb-8 overflow-hidden rounded-lg">
                                    <img src="" alt={entry.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                            ) : (
                                <div className="w-full aspect-[21/9] bg-[#0a0a0f] border border-wacca-border mb-8 flex items-center justify-center text-wacca-muted font-mono rounded-lg overflow-hidden relative">
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-black to-black" />
                                    [ CORRUPTED_VISUAL_FILE ]
                                </div>
                            )}
                            <p className="font-sans text-sm md:text-base leading-relaxed text-[#a1a1aa] group-hover:text-white transition-colors duration-500">
                                {entry.body}
                            </p>
                        </div>
                    </article>
                ))}
            </div>
        </main>
    );
}
