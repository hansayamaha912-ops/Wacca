import ClientOnlyBackgroundCity from '~/components/3d/ClientOnlyBackgroundCity';

export const meta = () => {
    return [
        { title: 'ABOUT | WACCA - Your City. Your Culture.' },
        { name: 'description', content: 'From Tokyo to Far, our products carry the energy of every city they touch.' },
    ];
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-wacca-darker relative overflow-x-hidden pt-32 px-6 md:px-12 selection:bg-wacca-red selection:text-white">
            {/* 3D Background */}
            <ClientOnlyBackgroundCity opacity={0.25} />

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-32 pb-48">
                {/* Intro Section */}
                <section className="animate-fade-in-up" style={{ animationFillMode: 'both', animationDuration: '1s' }}>
                    <div className="font-mono text-xs text-wacca-primary mb-6 tracking-widest uppercase">
                        [ SYS.NODE_INITIALIZATION ]
                    </div>
                    <h1 className="text-5xl md:text-8xl font-display font-bold text-white tracking-widest leading-[1.1] mb-8">
                        YOUR CITY.<br />
                        <span className="text-wacca-muted">YOUR CULTURE.</span>
                    </h1>
                    <p className="font-sans text-wacca-muted text-lg md:text-xl leading-relaxed max-w-2xl border-l-[1px] border-wacca-border pl-6">
                        At Wacca, we view the city not just as a backdrop, but as the medium itself.
                        Every product is an architectural fragment, engineered to resonate with the
                        structural frequency of your daily life.
                    </p>
                </section>

                {/* Convergence Section */}
                <section className="animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both', animationDuration: '1s' }}>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-8 tracking-wide">
                        THE CONVERGENCE
                    </h2>
                    <div className="group border border-wacca-border p-8 bg-wacca-darker/50 backdrop-blur-sm transition-colors hover:border-wacca-primary/50">
                        <p className="font-sans text-wacca-muted text-lg leading-loose max-w-2xl">
                            From Tokyo to Far. We bridge the aesthetics of high-end tactical wear with the
                            raw, unyielding beauty of metropolitan concrete. The rhythm of our operations
                            syncs with the pulse of Asia's great hubs—Bangkok, Ho Chi Minh, Shanghai, Taipei, Scoul, and Tokyo.
                            <br /><br />
                            It is more than commerce; it is an interconnected grid.
                        </p>
                    </div>
                </section>

                {/* Identity Section */}
                <section className="animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both', animationDuration: '1s' }}>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-8 tracking-wide text-right">
                        STRUCTURAL INTEGRITY
                    </h2>
                    <div className="flex justify-end">
                        <p className="font-sans text-wacca-muted text-lg leading-loose max-w-2xl text-right border-r-[1px] border-wacca-border pr-6">
                            Every stitch, every fold, every silhouette is tested against the concrete reality.
                            We discard the superfluous. What remains is pure utility wrapped in absolute dark aesthetics.
                            Welcome to the network.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
