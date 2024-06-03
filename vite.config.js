import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const API_URI =
    process.env.NODE_ENV === 'production'
        ? 'https://skdapi.tsabudh.com.np'
        : 'http://localhost:3000';

const WS_URI = process.env.NODE_ENV === 'production'
        ? 'ws://skdapi.tsabudh.com.np'
        : 'ws://localhost:3000';

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
    if (command === 'serve') {
        return {
            // dev specific config
            plugins: [react()],
            css: {
                preprocessorOptions: {
                    scss: {
                        // additionalData: `@use "/src/scss/abstract" as *;`,
                    },
                },
            },
            server: {
                host: true,
            },
            define: {
                // API_URI: `http://127.0.0.1:3000`,
                'process.env.API_URI': JSON.stringify(API_URI),
                'process.env.WS_URI':JSON.stringify(WS_URI)
            },
        };
    } else {
        // command === 'build'

        return {
            // build specific config
            plugins: [react()],
            define: {
                'process.env.API_URI': JSON.stringify(API_URI),
                'process.env.WS_URI':JSON.stringify(WS_URI)
            },
        };
    }
});
