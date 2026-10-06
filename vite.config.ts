// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv, type Plugin } from "vite";

function applyTelegramProcessEnv(mode: string) {
  const telegramEnv = loadEnv(mode, process.cwd(), "TELEGRAM_");
  for (const [key, value] of Object.entries(telegramEnv)) {
    if (!key.startsWith("TELEGRAM_") || !value || process.env[key]) continue;
    process.env[key] = value;
  }
}

function telegramServerEnvPlugin(): Plugin {
  return {
    name: "telegram-server-env",
    enforce: "pre",
    config(_config, { mode }) {
      applyTelegramProcessEnv(mode);
    },
    configureServer() {
      applyTelegramProcessEnv("development");
    },
  };
}

export default defineConfig({
  vite: {
    plugins: [telegramServerEnvPlugin()],
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
