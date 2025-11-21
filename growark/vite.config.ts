import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts: ['khhwdlyurnud.sealosbja.site','mcmgfetxlrug.sealosbja.site','lwjgmwwekkzw.sealosbja.site']
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.API_BASE_URL': JSON.stringify(env.API_BASE_URL || 'http://localhost:4000'),
        'process.env.WS_URL': JSON.stringify(env.WS_URL || env.API_BASE_URL || 'http://localhost:4000')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      preview: {
        host: true,
        port: 3000,
        allowedHosts: ['khhwdlyurnud.sealosbja.site']
      },
      build: {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
            bigscreen: path.resolve(__dirname, 'bigscreen/index.html'),
          }
        }
      }
    };
});
