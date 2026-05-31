import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    remix({
      presets: [],
      // VercelでSSR関数が正常にマッピングされるよう、標準のビルド構成を明示
      buildDirectory: "build",
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
    // node: モジュールをインポートに巻き込まず、Vercel環境に解決させるガード設定
    noExternal: [/^(?!node:).*$/],
    optimizeDeps: {
      include: [],
    },
  },
});