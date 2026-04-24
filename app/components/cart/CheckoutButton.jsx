import { useState } from 'react';
import { Form, Link } from '@remix-run/react';

/**
 * Direct Stripe Checkout initiator with legal agreement gate.
 * The checkout button is disabled until the user explicitly agrees
 * to the Commercial Transactions Policy and Terms of Service.
 *
 * @param {{
 *   variantId: string,
 *   productHandle: string,
 *   whatsUr20: string,
 *   disabled?: boolean,
 *   children?: React.ReactNode,
 * }} props
 */
export default function CheckoutButton({
    variantId,
    productHandle,
    whatsUr20,
    disabled = false,
    children,
}) {
    const [isAgreed, setIsAgreed] = useState(false);

    const isDisabled = disabled || !variantId || !whatsUr20?.trim() || !isAgreed;

    return (
        <Form action="/api/checkout" method="post">
            <input type="hidden" name="stripePriceId" value={variantId} />
            <input type="hidden" name="productHandle" value={productHandle} />
            <input type="hidden" name="location" value={whatsUr20?.trim() || ''} />

            {/* ─── Agreement Checkbox ─── */}
            <label
                className="group flex items-start gap-3 cursor-pointer select-none mb-5 py-3 px-4 rounded-md border transition-all duration-300"
                style={{
                    borderColor: isAgreed ? 'rgba(0, 255, 204, 0.3)' : 'rgba(30, 30, 46, 0.8)',
                    background: isAgreed ? 'rgba(0, 255, 204, 0.03)' : 'transparent',
                }}
            >
                {/* Custom checkbox */}
                <div className="relative mt-0.5 shrink-0">
                    <input
                        type="checkbox"
                        checked={isAgreed}
                        onChange={(e) => setIsAgreed(e.target.checked)}
                        className="sr-only"
                        aria-label="Agree to policies"
                    />
                    <div
                        className="w-4 h-4 border rounded-sm transition-all duration-300 flex items-center justify-center"
                        style={{
                            borderColor: isAgreed ? '#00ffcc' : '#3a3a4a',
                            background: isAgreed ? 'rgba(0, 255, 204, 0.15)' : 'transparent',
                            boxShadow: isAgreed ? '0 0 8px rgba(0, 255, 204, 0.3), inset 0 0 4px rgba(0, 255, 204, 0.1)' : 'none',
                        }}
                    >
                        {isAgreed && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path
                                    d="M2 5L4.5 7.5L8 3"
                                    stroke="#00ffcc"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        )}
                    </div>
                </div>

                {/* Agreement text */}
                <span
                    className="font-mono text-[11px] leading-relaxed transition-colors duration-300"
                    style={{ color: isAgreed ? '#d1d1d8' : '#6b6b7b' }}
                >
                    <span className="text-cyan-400/50">[</span>
                    {isAgreed ? ' ✓ ' : '   '}
                    <span className="text-cyan-400/50">]</span>
                    {' '}
                    <Link
                        to="/policies"
                        className="underline underline-offset-2 hover:text-cyan-400 transition-colors"
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                    >
                        特定商取引法に基づく表記
                    </Link>
                    {' '}および{' '}
                    <Link
                        to="/terms-of-service"
                        className="underline underline-offset-2 hover:text-cyan-400 transition-colors"
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                    >
                        利用規約
                    </Link>
                    {' '}に同意します。
                    <br />
                    <span className="text-[10px]" style={{ color: '#555' }}>
                        I AGREE TO THE COMMERCIAL TRANSACTIONS POLICY AND TERMS OF SERVICE.
                    </span>
                </span>
            </label>

            {/* ─── Submit Button ─── */}
            <button
                type="submit"
                className="btn-wacca group"
                disabled={isDisabled}
                style={{
                    width: '100%',
                    fontSize: 15,
                    padding: '16px 32px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {children || (
                    <div className="flex items-center justify-center gap-4">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Initiate Checkout
                        {/* Hover flare */}
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen" />
                    </div>
                )}
            </button>
        </Form>
    );
}
