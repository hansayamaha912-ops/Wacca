import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';
import { vercelPreset } from '@vercel/remix/vite';

export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
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
    // Exclude Node.js built-in modules from bundling to prevent Vercel build errors
    noExternal: [/^(?!node:).*$/],
    optimizeDeps: {
      include: [],
    },
  },
});