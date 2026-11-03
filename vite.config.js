import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // En GitHub Pages el sitio vive en /<repo>/: el workflow define BASE_PATH. En local queda "/".
  base: process.env.BASE_PATH || "/",
});
