import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import node from "@astrojs/node";
import sentry from "@sentry/astro";

export default defineConfig({
  // Set this URL when DNS configured
  site: "https://astro-nano-demo.vercel.app",
  integrations: [
    mdx(), 
    sitemap(), 
    tailwind(), 
    react(), 
    sentry({
      dsn: "https://d5125af91b291729449645d7875e47d6@o4505172549369856.ingest.us.sentry.io/4508826852458496",
      sourceMapsUploadOptions: {
        telemetry: false,
        project: "astro-portfolio",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
      release: process.env.GITHUB_SHA || 'default123456',
    })
  ],
  output: "server",
  security: {
    checkOrigin: true,
  },
  adapter: node({
    mode: "standalone",
  }),
});