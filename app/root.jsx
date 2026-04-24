import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from '@remix-run/react';
import appStyles from '~/styles/app.css?url';

/**
 * @type {import('@remix-run/server-runtime').LinksFunction}
 */
export const links = () => {
    return [
        { rel: 'stylesheet', href: appStyles },
        { rel: 'preconnect', href: 'https://cdn.shopify.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    ];
};

/**
 * @type {import('@remix-run/server-runtime').MetaFunction}
 */
export const meta = () => {
    return [
        { title: 'WACCA - Your City. Your Culture.' },
        { name: 'description', content: 'From Tokyo to Far, our products carry the energy of every city they touch.' },
    ];
};

/**
 * @param {import('@shopify/remix-oxygen').LoaderFunctionArgs} args
 */
export async function loader({ context }) {
    return {
        publicStoreDomain: context.env.PUBLIC_STORE_DOMAIN || 'http://localhost:3456',
        locale: context.locale || { currency: 'USD' }
    };
}

import { CommunityBar } from '~/components/ui/CommunityBar';
import { GlobalNavigation } from '~/components/ui/GlobalNavigation';
import { GlobalFooter } from '~/components/ui/GlobalFooter';
import { SyncProvider } from '~/lib/SyncContext';

export default function App() {
    const data = useLoaderData();

    return (
        <html lang="ja" suppressHydrationWarning={true}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
                <meta name="theme-color" content="#030303" />
                <Meta />
                <Links />
            </head>
            <body suppressHydrationWarning={true}>
                <SyncProvider>
                    <div className="flex flex-col min-h-screen">
                        <GlobalNavigation />
                        <Outlet />
                        <GlobalFooter />
                    </div>
                    <CommunityBar />
                </SyncProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

import { useRouteError } from '@remix-run/react';

export function ErrorBoundary() {
    const error = useRouteError();
    console.error(error);
    
    return (
        <html lang="ja" suppressHydrationWarning={true}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body suppressHydrationWarning={true}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    background: '#050a05', /* Match Wacca theme background */
                    color: '#00ff41',
                    fontFamily: 'monospace',
                    padding: '24px',
                }}>
                    <div style={{ maxWidth: '600px', width: '100%', border: '1px solid rgba(0, 255, 65, 0.3)', padding: '32px', background: 'rgba(0,0,0,0.8)' }}>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '16px', letterSpacing: '0.1em' }}>
                            [ FATAL ERROR DETECTED ]
                        </h1>
                        <p style={{ color: '#b4f0b4', marginBottom: '24px', fontSize: '14px' }}>
                            SYSTEM HALTED. THE FOLLOWING EXCEPTION WAS THROWN:
                        </p>
                        <pre style={{
                            background: '#000',
                            padding: '16px',
                            borderRadius: '4px',
                            border: '1px solid #111',
                            overflowX: 'auto',
                            color: '#E63946',
                            fontSize: '12px',
                            lineHeight: '1.6'
                        }}>
                            {error?.message || error?.statusText || "Unknown System Error"}
                        </pre>
                        <button 
                            onClick={() => window.location.reload()}
                            style={{
                                marginTop: '24px',
                                padding: '8px 16px',
                                background: 'transparent',
                                border: '1px solid #00ff41',
                                color: '#00ff41',
                                cursor: 'pointer',
                                fontFamily: 'monospace',
                            }}
                        >
                            &gt; REBOOT_SYSTEM
                        </button>
                    </div>
                </div>
                <Scripts />
            </body>
        </html>
    );
}
