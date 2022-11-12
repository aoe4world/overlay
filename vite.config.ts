import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa'
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [
    solidPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['index.html', 'assets/*.*']
      }
    })
  ],
  server: {
    port: 3132,
  },
  build: {
    target: 'esnext',
    modulePreload: false
  },
});
