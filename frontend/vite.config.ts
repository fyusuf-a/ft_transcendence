import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: {
      port: 443,
    },
  },
  plugins: [
    vue(),
    checker({
      vueTsc: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@dtos': path.resolve(__dirname, '@/dtos'),
    },
  },
  optimizeDeps: {
    exclude: [
      'class-transformer/storage',
      '@nestjs/platform-express',
      '@nestjs/microservices',
      '@nestjs/websockets/socket-module',
      'cache-manager',
    ],
  },
});
