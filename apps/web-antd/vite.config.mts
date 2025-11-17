import type { DefineConfig } from '@vben/vite-config';

import { defineConfig } from '@vben/vite-config';

const config: DefineConfig = async () => ({
  application: {},
  vite: {
    server: {
      proxy: {
        '/admin-api': {
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/admin-api/, ''),
          target: 'http://192.168.0.27:48080/admin-api',
          ws: true,
        },
      },
    },
  },
});

export default defineConfig(config) as unknown as any;
