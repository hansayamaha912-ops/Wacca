import { useState, useEffect } from 'react';

export default function ClientOnlyBackgroundCity({ opacity = 0.2 }) {
    const [Component, setComponent] = useState(null);

    useEffect(() => {
        import('./BackgroundCityCanvas').then((mod) => {
            setComponent(() => mod.default);
        });
    }, []);

    if (!Component) return null;
    return <Component opacity={opacity} />;
}
