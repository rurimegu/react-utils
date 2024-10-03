import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

const packageJson = require('./package.json');
const EXCLUDES = ['src/web/**/*'];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({ tsconfigPath: './tsconfig.app.json', exclude: ['src/web'] }),
  ],
  build: {
    lib: {
      name: packageJson.name,
      fileName: 'index',
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.dependencies), ...EXCLUDES],
      treeshake: {
        moduleSideEffects: 'no-external',
      },
    },
  },
});
