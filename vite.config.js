import {defineConfig} from 'vite';
import {vitePlugin as remix} from '@remix-run/dev';
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
    // node:モジュールを強制除外してVercelのインフラ側に安全に解決させる設定
    noExternal: [/^(?!node:).*$/],
    optimizeDeps: {
      include: [],
    },
  },
});