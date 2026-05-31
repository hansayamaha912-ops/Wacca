import { Links, Meta, Outlet, Scripts } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';

export async function loader() {
  return json({});
}

export default function App() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body style={{ margin: 0, backgroundColor: '#0a0a0c', color: '#fff', fontFamily: 'monospace' }}>
        <Outlet />
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
                    background: '#050a05',
                    color: '#00ff41',
                    fontFamily: 'monospace',
                    padding: '24px',
                }}>
                    <div style={{ maxWidth: '600px', width: '100%', border: '1px solid rgba(0, 255, 65, 0.3)', padding: '32px', background: 'rgba(0,0,0,0.8)' }}>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '16px', letterSpacing: '0.1em' }}>
                            [ EMERGENCY RESCUED MODE ]
                        </h1>
                        <p style={{ color: '#b4f0b4', marginBottom: '24px', fontSize: '14px' }}>
                            STRIPE COMPLIANCE ACTIVE. SYSTEM GUARDED:
                        </p>
                        <pre style={{
                            background: '#000',
                            padding: '16px',
                            borderRadius: '4px',
                            border: '1px solid #111',
                            overflowX: 'auto',
                            color: '#e63946',
                            fontSize: '12px',
                            lineHeight: '1.6'
                        }}>
                            {error?.message || error?.statusText || "Render Context Isolated Successfully."}
                        </pre>
                        <a 
                            href="/policies"
                            style={{
                                display: 'inline-block',
                                marginTop: '24px',
                                padding: '8px 16px',
                                background: 'transparent',
                                border: '1px solid #00ff41',
                                color: '#00ff41',
                                textDecoration: 'none',
                                fontFamily: 'monospace',
                            }}
                        >
                            &gt; FORCE_LOAD_POLICIES_PAGE
                        </a>
                    </div>
                </div>
                <Scripts />
            </body>
        </html>
    );
}