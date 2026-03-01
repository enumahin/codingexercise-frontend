import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUser = env.VITE_API_USERNAME || 'user'
  const apiPass = env.VITE_API_PASSWORD || 'pass'

  return {
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
    },
    server: {
      port: 5173,
      host: true,
      // Dev-only proxy: avoid CORS by going same-origin to /api, then proxy to backend
      ...(mode === 'development' && {
        proxy: {
          '/api': {
            target: 'http://localhost:8077',
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/api/, ''),
            auth: `${apiUser}:${apiPass}`,
          },
        },
      }),
    },
  }
})
