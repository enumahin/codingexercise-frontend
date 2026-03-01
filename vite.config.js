import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env (like mynebofrontend) so VITE_API_URL etc. are available
  loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
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
            auth: 'user:pass',
          },
        },
      }),
    },
  }
})
