/**
 * Lightweight Background City for Vercel deployment.
 * All Three.js/R3F rendering has been removed to reduce serverless function size.
 * This displays a simple CSS-based background pattern instead.
 */

export default function BackgroundCityCanvas({ opacity = 0.2 }) {
    return (
        <div
            className="fixed inset-0 pointer-events-none z-0"
            style={{
                opacity,
                mixBlendMode: 'screen',
                background: 'radial-gradient(ellipse at center, #111 0%, #030303 100%)',
                overflow: 'hidden',
            }}
        >
            {/* Simple grid pattern to suggest a city */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `
                    linear-gradient(rgba(0, 255, 65, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0, 255, 65, 0.03) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
            }} />
            
            {/* Subtle animated glow */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '300px',
                height: '300px',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(0, 255, 65, 0.1) 0%, transparent 70%)',
                animation: 'bgPulse 4s ease-in-out infinite',
            }} />
            
            <style>{`
                @keyframes bgPulse {
                    0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                }
            `}</style>
        </div>
    );
}