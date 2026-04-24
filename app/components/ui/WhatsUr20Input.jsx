import { useState, useEffect } from 'react';

/**
 * "What's ur 20?" — Custom UX input component.
 * Cyberpunk Digital Instrument style.
 *
 * @param {{value: string, onChange: (val: string) => void, error?: string}} props
 */
export default function WhatsUr20Input({ value, onChange, error }) {
    const [focused, setFocused] = useState(false);
    const [coords, setCoords] = useState('[LAT: 35.6895° N, LNG: 139.6917° E]');

    // Cyberpunk coordinates animation
    useEffect(() => {
        const interval = setInterval(() => {
            const lat = (35.6895 + (Math.random() * 0.001 - 0.0005)).toFixed(4);
            const lng = (139.6917 + (Math.random() * 0.001 - 0.0005)).toFixed(4);
            setCoords(`[LAT: ${lat}° N, LNG: ${lng}° E]`);
        }, 150);
        return () => clearInterval(interval);
    }, []);

    // Map parent error to cyberpunk error
    const displayError = error ? "[ ERR: LOCATION UNKNOWN ]" : null;

    return (
        <div style={{ marginBottom: 20 }}>
            {/* Header / Labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                <label
                    htmlFor="whats-ur-20"
                    style={{
                        display: 'block',
                        fontFamily: '"Noto Sans JP", "Outfit", sans-serif',
                        fontSize: 13,
                        fontWeight: 700,
                        color: focused ? '#00ffff' : '#fff',
                        letterSpacing: '0.05em',
                        transition: 'color 0.3s ease',
                    }}
                >
                    WHAT'S UR 20? <span style={{ fontSize: 10, color: '#8B8B9E', fontWeight: 400 }}>// YOUR LOCATION</span>
                </label>

                {/* Flashing Coordinates Label */}
                <span style={{
                    fontFamily: 'monospace',
                    fontSize: 10,
                    color: '#00ffff',
                    opacity: 0.8,
                    letterSpacing: '0.02em',
                }}>
                    {coords}
                </span>
            </div>

            {/* Input Wrapper */}
            <div style={{ position: 'relative' }}>
                <input
                    id="whats-ur-20"
                    name="whatsUr20"
                    type="text"
                    className={`input-wacca font-mono ${focused ? 'border-cyan-500' : 'border-wacca-border'} ${displayError ? 'border-wacca-red text-wacca-red' : ''}`}
                    style={{
                        backgroundColor: '#050508',
                        color: displayError ? '#ff4757' : (focused ? '#00ffff' : '#fff'),
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderColor: displayError ? '#E63946' : (focused ? '#00ffff' : '#1E1E2E'),
                        boxShadow: focused && !displayError ? '0 0 10px rgba(0, 255, 255, 0.2)' : 'none',
                        transition: 'all 0.15s ease-out',
                    }}
                    placeholder="ENTER YOUR VIBE..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    required
                    autoComplete="off"
                />
            </div>

            {/* Digital Error Message */}
            <div style={{ height: 20, marginTop: 4 }}>
                {displayError && (
                    <span className="font-mono" style={{
                        fontSize: 12,
                        color: '#ff4757',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        animation: 'pulseGlow 2s infinite',
                        textShadow: '0 0 5px rgba(255, 71, 87, 0.5)'
                    }}>
                        <span style={{ width: 8, height: 8, background: '#ff4757', display: 'inline-block' }} />
                        {displayError}
                    </span>
                )}
            </div>
        </div>
    );
}
