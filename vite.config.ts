import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
<<<<<<< HEAD
    const apiUrl = env.VITE_API_URL || 'http://localhost:8080';
    
=======
>>>>>>> b2df92e (first commit)
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
<<<<<<< HEAD
            target: apiUrl,
            changeOrigin: true,
          },
          '/uploads': {
            target: apiUrl,
            changeOrigin: true,
          },
          '/sitemap.xml': {
            target: apiUrl,
            changeOrigin: true,
            rewrite: (path) => '/api/sitemap.xml',
          },
=======
            target: 'http://localhost:8080',
            changeOrigin: true,
          },
          '/uploads': {
            target: 'http://localhost:8080',
            changeOrigin: true,
          },
>>>>>>> b2df92e (first commit)
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
<<<<<<< HEAD
          '@': path.resolve(__dirname, './src'),
=======
          '@': path.resolve(__dirname, '.'),
>>>>>>> b2df92e (first commit)
        }
      }
    };
});
