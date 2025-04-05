import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(async () => {
  return {
    build: {
      target: 'esnext',
    },
    define: {
      'import.meta.env.APP_VERSION': `"${process.env.GITHUB_SHA ?? 'local'}"`,
    },
    server: {
      port: 3030,
      hmr: true,
      host: '0.0.0.0',
      watch: {
        usePolling: true,
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/'),
      },
    },
    test: {
      environment: 'happy-dom',
    },
    plugins: [react(), tailwindcss()],
  };
});
