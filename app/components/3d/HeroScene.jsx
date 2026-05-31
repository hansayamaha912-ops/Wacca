/**
 * Lightweight Hero Scene for Vercel deployment.
 * All heavy 3D model loading has been removed to reduce serverless function size.
 * This displays a simple placeholder instead of the full 3D experience.
 */

export default function HeroScene() {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#050a05',
            position: 'relative',
        }}>
            {/* Simple animated placeholder */}
            <div style={{
                textAlign: 'center',
                color: '#00ff41',
                fontFamily: 'monospace',
            }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    margin: '0 auto 20px',
                    border: '2px solid #00ff41',
                    borderRadius: '50%',
                    animation: 'pulse 2s ease-in-out infinite',
                }} />
                <p style={{
                    fontSize: '14px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                }}>
                    WACCA 3D EXPERIENCE
                </p>
                <p style={{
                    fontSize: '10px',
                    color: '#8B8B9E',
                    marginTop: '8px',
                }}>
                    [ LIGHTWEIGHT MODE ]
                </p>
            </div>
            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                }
            `}</style>
        </div>
    );
}