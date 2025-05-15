
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    commonjsOptions: {
      // Handle packages that use Node.js-specific features
      transformMixedEsModules: true,
    },
  },
  define: {
    // Polyfill global variables
    'process.env': {},
    '__dirname': 'window.location.pathname',
    'global': 'window',
  },
  optimizeDeps: {
    // Exclude problematic Node-only dependencies
    exclude: ['swisseph'],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
}));
