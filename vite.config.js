import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/ZapDrop/',
  define: { global: 'globalThis' },
  resolve: {
    alias: {
      '@': '/src',
      // Stub out the broken tongo-sdk so it never gets bundled
      '@fatsolutions/tongo-sdk': resolve(__dirname, 'src/lib/tongo-stub.js'),
    },
  },
  optimizeDeps: {
    exclude: ['starkzap'],
  },
})
