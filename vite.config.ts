import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import fs from "fs"
import path from "path"

const localhostKeyPath = "./certs/localhost-key.pem"
const localhostCertPath = "./certs/localhost.pem"

const hasLocalCerts =
  fs.existsSync(localhostKeyPath) && fs.existsSync(localhostCertPath)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "localhost",
    port: 5173,
    strictPort: true,
    https: hasLocalCerts
      ? {
          key: fs.readFileSync(localhostKeyPath),
          cert: fs.readFileSync(localhostCertPath),
        }
      : undefined,
    hmr: {
      protocol: hasLocalCerts ? "wss" : "ws",
      host: "localhost",
      clientPort: 5173,
    },
    proxy: {
      "/api": {
        target: "https://localhost:7144",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
