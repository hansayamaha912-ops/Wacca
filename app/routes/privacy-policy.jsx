export const meta = () => [{ title: 'PRIVACY POLICY | WACCA' }];

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-wacca-darker text-white pt-32 pb-48 px-6 md:px-12 selection:bg-wacca-red selection:text-white">
            <div className="max-w-3xl mx-auto">
                <header className="mb-16 border-b border-wacca-border pb-8">
                    <h1 className="font-display text-4xl tracking-widest uppercase mb-4 text-white">
                        Privacy Protocol
                    </h1>
                    <div className="font-mono text-xs text-wacca-muted tracking-widest">
                        [ SYS.DOC.ID: PRIV-SEC-09 ]
                    </div>
                </header>

                <div className="space-y-12 font-sans text-sm md:text-base text-[#d1d1d8] leading-relaxed">
                    <section>
                        <h2 className="font-mono text-xs text-wacca-muted tracking-[0.2em] mb-4 uppercase">
                            // 01. Data Harvesting
                        </h2>
                        <p>
                            When you synchronize your coordinates via the WACCA Network, we log encrypted telemetry regarding your location (e.g., GEO/IP routing). This data is strictly utilized to render the 'System Synchronization' user experience and optimize our local network caching.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-mono text-xs text-wacca-muted tracking-[0.2em] mb-4 uppercase">
                            // 02. Third-Party Routing
                        </h2>
                        <p>
                            Payments are securely managed by Shopify APIs. Your core financial data operates outside of our direct server instances and rests within encrypted, decentralized payment gateways. We do not sell your telemetry records to analytical brokers.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-mono text-xs text-wacca-muted tracking-[0.2em] mb-4 uppercase">
                            // 03. Node Erasure
                        </h2>
                        <p>
                            At any given point, you reserve the right to prompt a total deletion of your localized records from the WACCA mainframe. Submit a wipe request to our support channels and your node will be fully disconnected.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
