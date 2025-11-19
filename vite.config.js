import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// If you're NOT using a custom domain and will host at /<username>.github.io/<repo>/,
// set base to "/kizuna-site/" (your repo name). If you WILL use a custom domain,
// you can leave base as "/".
export default defineConfig({
  plugins: [react()],
  base: "/",
});
