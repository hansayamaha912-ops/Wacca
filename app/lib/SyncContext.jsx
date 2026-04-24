import { createContext, useContext, useState, useEffect } from 'react';

const SyncContext = createContext({
    isSynchronized: false,
    syncedCity: null,
    setSynchronized: () => { }
});

export function SyncProvider({ children }) {
    const [isSynchronized, setIsSynchronized] = useState(false);
    const [syncedCity, setSyncedCity] = useState(null);
    const [flash, setFlash] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('WACCA_SYNC_CITY');
            if (saved) {
                setSyncedCity(saved);
                setIsSynchronized(true);
            }
        } catch (e) { }
    }, []);

    const setSynchronized = (city) => {
        if (!city) return;
        const formatted = city.toUpperCase();
        setSyncedCity(formatted);
        setIsSynchronized(true);

        try {
            localStorage.setItem('WACCA_SYNC_CITY', formatted);
        } catch (e) { }

        // Trigger powerful 1-frame flush animation (approx 50ms)
        setFlash(true);
        setTimeout(() => setFlash(false), 50);
    };

    return (
        <SyncContext.Provider value={{ isSynchronized, syncedCity, setSynchronized }}>
            {flash && <div className="fixed inset-0 bg-white z-[99999] opacity-100 pointer-events-none" />}
            <div
                className="transition-all duration-[2000ms] ease-out min-h-screen"
                style={{
                    filter: isSynchronized ? 'contrast(1.15) saturate(1.2)' : 'none',
                }}
            >
                {children}
            </div>
        </SyncContext.Provider>
    );
}

export const useSync = () => useContext(SyncContext);
