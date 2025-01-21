import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path-browserify';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    },
    include: ['postcss'],
 },
  define: {
    global: 'globalThis',
    'process.env': process.env,
  },
  plugins: [react()],  
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', 
        changeOrigin: true, 
        secure: false, 
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
  resolve: {
    alias: {
       '@locales': path.resolve(__dirname, 'src/locales'),
    },
  },
  
})
