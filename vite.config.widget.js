import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import alias from "@rollup/plugin-alias";

export default defineConfig({
  plugins: [
    react(),
    alias({
      entries: [{ find: "@", replacement: resolve(__dirname, "src") }],
    }),
  ],
  css: {
    postcss: "./postcss.config.js", // Ensure PostCSS processes CSS
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/web-component.tsx"),
      name: "Widget",
      fileName: () => "widget.umd.js",
      formats: ["umd"],
    },
    cssCodeSplit: false, // Don't split CSS - include it all inline
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        format: "umd",
      },
      treeshake: false, // Disable tree shaking to ensure side effects are included
    },
    outDir: "public",
    emptyOutDir: false,
  },
});
