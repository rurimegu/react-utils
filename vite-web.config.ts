import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ViteYaml from '@modyfi/vite-plugin-yaml';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ViteYaml()],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
