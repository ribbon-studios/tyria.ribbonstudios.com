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
    server: {
      port: 3030,
      hmr: true,
      host: '0.0.0.0',
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
