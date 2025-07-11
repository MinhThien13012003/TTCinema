import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    proxy: {
      "/api": {
        target: "https://contemporary-leia-vominhthien-093a2625.koyeb.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
