export const meta = () => [{ title: 'TERMS OF SERVICE | WACCA' }];

export default function TermsOfService() {
    return (
        <main className="min-h-screen bg-wacca-darker text-white pt-32 pb-48 px-6 md:px-12 selection:bg-wacca-red selection:text-white">
            <div className="max-w-3xl mx-auto">
                <header className="mb-16 border-b border-wacca-border pb-8">
                    <h1 className="font-display text-4xl tracking-widest uppercase mb-4 text-white">
                        Terms of Service
                    </h1>
                    <div className="font-mono text-xs text-wacca-muted tracking-widest">
                        [ SYS.DOC.ID: TOS-GLOBAL-V2 ]
                    </div>
                </header>

                <div className="space-y-12 font-sans text-sm md:text-base text-[#d1d1d8] leading-relaxed">
                    <section>
                        <h2 className="font-mono text-xs text-wacca-muted tracking-[0.2em] mb-4 uppercase">
                            // 01. Interaction Agreement
                        </h2>
                        <p>
                            By synchronizing with the WACCA platform, the user (Node) agrees to abide by the underlying structural logic of our community. All visual assets, objects, and concepts generated here are classified under the centralized property rights of WACCA TOKYO.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-mono text-xs text-wacca-muted tracking-[0.2em] mb-4 uppercase">
                            // 02. Unauthorized Modifications
                        </h2>
                        <p>
                            Attempting to deconstruct, reverse-engineer, or counterfeit WACCA's digital interfaces or physical products will result in an immediate network ban. Our aesthetics remain our proprietary core.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-mono text-xs text-wacca-muted tracking-[0.2em] mb-4 uppercase">
                            // 03. Protocol Updates
                        </h2>
                        <p>
                            This framework is subject to silent over-the-air updates without prior user consent. It is the responsibility of the connected User to periodically review the system logs documented here.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
