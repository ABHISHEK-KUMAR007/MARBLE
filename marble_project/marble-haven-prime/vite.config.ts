// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
//import { defineConfig } from "@lovable.dev/vite-tanstack-config";

//export default defineConfig({
  //tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
   // server: { entry: "server" },
//  },
//});

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
<<<<<<< HEAD
  nitro: {
    preset: "netlify",
  },
=======
  vite: {
    preview: {
      host: "0.0.0.0",
      allowedHosts: ["marble-8.onrender.com"],
    },
  },

>>>>>>> origin/master
  tanstackStart: {
    server: { entry: "server" },
  },
});
