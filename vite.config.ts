import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist-react",
    emptyOutDir: true, // Clean output before build
  },
  server: {
    port: 5123, // Dev server port
    strictPort: true,
  },
});
