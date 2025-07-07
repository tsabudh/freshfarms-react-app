import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resolve = {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "~": path.resolve(__dirname, "src"),
    },
  };


const API_URI =
    process.env.NODE_ENV === 'production'
        ? 'https://freshfarms-express-server.onrender.com'
        : 'http://localhost:3000';

const WS_URI =
    process.env.NODE_ENV === 'production'
        ? 'wss://freshfarms-express-server.onrender.com'
        : 'ws://localhost:3000';

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
    if (command === 'serve') {
        return {
            // dev specific config
            plugins: [react(), ],

            server: {
                host: true,
            },
            define: {
                'process.env.API_URI': JSON.stringify(API_URI),
                'process.env.WS_URI': JSON.stringify(WS_URI),
            },
            resolve
        };
    } else {
        // command === 'build'

        return {
            // build specific config
            plugins: [react(),visualizer({
                open: true, // opens the report automatically in your browser
                gzipSize: true,
                brotliSize: true,
                filename: 'dist/report.html',
            })],
            define: {
                'process.env.API_URI': JSON.stringify(API_URI),
                'process.env.WS_URI': JSON.stringify(WS_URI),
            },
            resolve
        };
    }
});
