/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import checker from 'vite-plugin-checker';
import path from 'path';
import vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: false,
  },
  plugins: [
    vue(),
    checker({
      vueTsc: true,
    }),
    {
      name: 'vitest-plugin-before-all',
      config: () => ({
        test: { setupFiles: ['./vitest/beforeall.ts'] },
      }),
    },
    vuetify({
      autoImport: true,
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    deps: {
      inline: ['vuetify'],
    },
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@dtos': path.resolve(__dirname, './src/dtos'),
      '@tests': path.resolve(__dirname, './tests'),
      '@nestjs/swagger': path.resolve(__dirname, './src/shims-nestjs.d'),
    },
  },
  clearScreen: false,
  logLevel: 'error',
});
