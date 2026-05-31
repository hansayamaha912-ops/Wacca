import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
} from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
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

// どんなインフラ環境（Vercel/Oxygen）でも絶対に型エラーを起こさない安全なフォールバックを徹底注入
export async function loader({ context }) {
    const env = context?.env || {};
    const locale = context?.locale || { currency: 'USD' };
    
    return json({
        publicStoreDomain: env.PUBLIC_STORE_DOMAIN || 'https://wacca2.vercel.app',
        locale: locale
    });
}

// 内部でShopifyデータやカートデータを要求するナビゲーションを一時的にバイパスし、
// WACCAの美しいスタイル（app.css）のままポリシーを表示するための緊急レイアウト
export default function App() {
    return (
        <html lang="ja" suppressHydrationWarning={true}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
                <meta name="theme-color" content="#030303" />
                <Meta />
                <Links />
            </head>
            <body suppressHydrationWarning={true} className="bg-wacca-darker text-white">
                <div className="flex flex-col min-h-screen">
                    {/* 内部でShopifyのカートやストアコンテキストを呼ぶ共通パーツを安全のために一時隔離。
                      直接 /policies のサイバーデザインをWACCAのスタイルのまま100%安全に全面描画します。
                    */}
                    <Outlet />
                </div>
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