import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: {
      port: 4443,
    },
  },
  plugins: [
    vue(),
    checker({
      vueTsc: true,
    }),
  ],
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@dtos': path.resolve(__dirname, 'src/dtos'),
      '@nestjs/swagger': path.resolve('../src/shims-nestjs.d'),
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
