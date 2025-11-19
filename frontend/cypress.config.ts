import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200", // ✅ frontend Angular
    setupNodeEvents(on, config) {
      // eventos opcionais
    },
  },
});