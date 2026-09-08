import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.svg",
        "apple-touch-icon.png",
        "pwa-192x192.png",
        "pwa-512x512.png"
      ],

      manifest: {
        name: "Acessível Já",
        short_name: "Acessível Já",
        description:
          "Aplicativo de mobilidade, acessibilidade e serviços para pessoas com deficiência.",

        theme_color: "#173b57",
        background_color: "#faf9f5",

        display: "standalone",

        start_url: "/",
        scope: "/",

        orientation: "portrait",

        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },

          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },

          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },

      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg}"
        ]
      }
    })
  ]
});