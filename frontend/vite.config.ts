/// <reference types="vitest" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import checker from 'vite-plugin-checker';
import path from 'path';
import vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: {
      port: 4443,
    },
  },
  plugins: [
    vue(),
    //checker({
    //vueTsc: true,
    //}),
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
      //'class-transformer': path.resolve(
      //__dirname,
      //'./node_modules/class-transformer',
      //),
      //'class-validator': path.resolve(
      //__dirname,
      //'./node_modules/class-validator',
      //),
    },
    //[
    //  {
    //    find: /^@dtos\/(.*)$/,
    //    replacement: `${path.resolve('../dtos/')}/$1`,
    //  },
    //  {
    //    find: /^@\/(.*)$/,
    //    replacement: `${path.resolve('./src/')}/$1`,
    //  },
    //  {
    //    find: /^@tests\/(.*)$/,
    //    replacement: `${path.resolve('./tests/')}/$1`,
    //  },
    //  {
    //    find: '@nestjs/swagger',
    //    replacement: './src/shims-nestjs.d',
    //  },
    //  {
    //    find: /^class-validator\/(.*)$/,
    //    replacement: `${path.resolve('./node_modules/class-validator')}/$1`,
    //  },
    //  {
    //    find: /^class-transformer\/(.*)$/,
    //    replacement: `${path.resolve('./node_modules/class-transformer')}/$1`,
    //  },
    //  {
    //    find: /^@nestjs\/mapped_types\/(.*)$/,
    //    replacement: `${path.resolve('./@nestjs/mapped_types')}/$1`,
    //  },
    //],
  },
  clearScreen: false,
  logLevel: 'error',
});
