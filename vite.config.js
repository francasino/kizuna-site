import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function spaFallbackPlugin() {
  return {
    name: "spa-fallback-plugin",
    closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      const indexPath = path.join(distDir, "index.html");
      if (fs.existsSync(indexPath)) {
        // Create 404.html for GitHub Pages fallback
        fs.copyFileSync(indexPath, path.join(distDir, "404.html"));

        // Create direct subfolder index.html for clean URL direct loading
        const subpageDir = path.join(distDir, "projecte_absentisme_diputacio_2026");
        if (!fs.existsSync(subpageDir)) {
          fs.mkdirSync(subpageDir, { recursive: true });
        }
        fs.copyFileSync(indexPath, path.join(subpageDir, "index.html"));
      }
    }
  };
}

// If you're NOT using a custom domain and will host at /<username>.github.io/<repo>/,
// set base to "/kizuna-site/" (your repo name). If you WILL use a custom domain,
// you can leave base as "/".
export default defineConfig({
  plugins: [react(), spaFallbackPlugin()],
  base: "/",
});
