import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import checker from 'vite-plugin-checker';
import path from 'path';

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
    alias: [
      {
        find: /^@dtos(.*)$/,
        replacement: `${path.resolve('../dtos/')}$1`,
      },
      {
        find: /^@\/(.*)$/,
        replacement: `${path.resolve('./src/')}/$1`,
      },
      {
        find: '@nestjs/swagger',
        replacement: './src/shims-nestjs.d',
      },
    ],
  },
  clearScreen: false,
  logLevel: 'error',
});
