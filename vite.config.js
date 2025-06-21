import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

const API_URI =
    process.env.NODE_ENV === 'production'
        ? 'https://skdapi.tsabudh.com.np'
        : 'http://localhost:3000';

const WS_URI =
    process.env.NODE_ENV === 'production'
        ? 'wss://skdapi.tsabudh.com.np'
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
        };
    }
});
