import { useState, useEffect } from 'react';

/**
 * A utility component to prevent hydration mismatches by ensuring the 
 * children are only rendered strictly on the client side.
 */
export function ClientOnly({ children, fallback = null }) {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    return hydrated ? children : fallback;
}
