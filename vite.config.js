import { defineConfig } from 'vite';
import { vitePlugin as remix } from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';
import { vercelPreset } from '@vercel/remix/vite';

export default defineConfig({
  plugins: [
    remix({
      presets: [vercelPreset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        v3_singleFetch: false,
      },
    }),
    tsconfigPaths(),
  ],
  ssr: {
    noExternal: [/^(?!node:).*$/],
  },
  // ───【追加】見つからないShopifyパッケージをビルド時に安全に無視させる設定 ───
  build: {
    rollupOptions: {
      external: [
        '@shopify/hydrogen',
        '@shopify/remix-oxygen',
        '@shopify/mini-oxygen'
      ]
    }
  }
});