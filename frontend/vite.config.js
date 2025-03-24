import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: "window", // Fix for Simple-Peer WebRTC
  },
  server: {
    proxy: {
      "/api": {  // Fixed missing slash in "api"
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
