import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vite only exposes env vars prefixed "VITE_" to the client bundle by
  // default. Our deploy uses API_URL (no prefix) instead, so it has to be
  // added here or import.meta.env.API_URL would be undefined in the browser.
  envPrefix: ["VITE_", "API_"],
})
