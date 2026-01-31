import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === "serve";

  return {
    plugins: [react()],
    publicDir: "./static",
    base: "./",
    css: {
      postcss: {
        plugins: [tailwind()],
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: isDev
      ? {
          proxy: {
            "/api": {
              target: "http://localhost:3000",
              changeOrigin: true,
              secure: false,
              configure: (proxy, _options) => {
                proxy.on('error', (err, _req, _res) => {
                  console.log('proxy error', err);
                });
                proxy.on('proxyReq', (proxyReq, req, _res) => {
                  console.log('Sending Request to the Target:', req.method, req.url);
                });
                proxy.on('proxyRes', (proxyRes, req, _res) => {
                  console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                });
              },
            },
          },
        }
      : undefined,
  };
});
