import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
      globals: {
        Buffer: true,
        process: true,
        global: true
      }
    }),
  ],
  base: '/DirectShare/',
  resolve: {
    alias: {
      global: 'globalThis',
      stream: 'stream-browserify',
      crypto: 'crypto-browserify'
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
    exclude: ['bittorrent-dht', 'bittorrent-tracker', 'webtorrent']
  },
  build: {
    rollupOptions: {
      external: ['bittorrent-dht', 'bittorrent-tracker']
    }
  }
})
