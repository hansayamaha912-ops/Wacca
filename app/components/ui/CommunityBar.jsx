import { useState, useEffect } from 'react';
import { useSync } from '~/lib/SyncContext';

export function CommunityBar() {
    const [city, setCity] = useState('');
    const { isSynchronized, syncedCity, setSynchronized } = useSync();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            setSynchronized(city);
        }
    };

    if (!mounted) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full z-40">
            <div
                className={`w-full backdrop-blur-md border-t text-xs md:text-sm font-mono tracking-widest px-4 py-3 flex justify-center items-center transition-all duration-700 z-50 relative
          ${isSynchronized ? 'bg-wacca-darker/90 border-wacca-primary/50' : 'bg-[#050505]/80 border-[#222]'}
        `}
            >
                {isSynchronized ? (
                    <div className="flex items-center space-x-3">
                        <span className="w-2 h-2 rounded-full bg-wacca-primary animate-[pulse_0.5s_ease-in-out_infinite]"></span>
                        <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] font-bold">
                            WELCOME TO THE CIRCLE. [ {syncedCity.toUpperCase()} ]
                        </span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex items-center space-x-4 w-full max-w-md">
                        <span className="text-[#666] shrink-0">ENTER YOUR 20: </span>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. TOKYO"
                            className="bg-transparent border-b border-[#333] focus:border-white focus:outline-none text-white text-center w-full pb-1 transition-colors uppercase placeholder:text-[#333]"
                            required
                        />
                        <button
                            type="submit"
                            className="text-[#8ba4b5] hover:text-white transition-colors shrink-0"
                        >
                            [ CONNECT ]
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
