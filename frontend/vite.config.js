import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5174,
    headers: {
      // Synchronized with your app needs: Allow proxy, media, and frames
      "Content-Security-Policy": [
        "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;",
        "script-src * 'unsafe-inline' 'unsafe-eval' blob: https://checkout.flutterwave.com;",
        "connect-src * 'unsafe-inline' blob: data:;",
        "media-src * blob: data:;",
        "img-src * data: blob:;",
        "frame-src *;" 
      ].join(' ')
    },
  },
})