import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// TODO: zameni sa pravim domenom pre deploy-a
export default defineConfig({
  site: "https://example.com",
  vite: {
    plugins: [tailwindcss()],
  },
});
