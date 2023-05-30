import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import legacy from "@vitejs/plugin-legacy";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
    react(),
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src"),
      },
      {
        find: "style",
        replacement: resolve(__dirname, "src/style"),
      },
      {
        find: "utils",
        replacement: resolve(__dirname, "src/utils"),
      },
      {
        find: "pages",
        replacement: resolve(__dirname, "src/pages"),
      },
      {
        find: "components",
        replacement: resolve(__dirname, "src/components"),
      },
      {
        find: "@quarkunlimit/qu-mobx",
        replacement: "@quarkunlimit/qu-mobx/dist/index.js",
      },
    ],
  },
  server: {
    port: 5467,
    host: "0.0.0.0",
  },
});
