import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://everythink.pro",
  vite: {
    plugins: [tailwindcss()],
  },
});
