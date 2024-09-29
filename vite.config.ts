import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: './tsconfig.app.json' })],
  build: {
    lib: {
      name: '@rurino/react-utils',
      fileName: 'index',
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        '@rurino/core',
        '@uidotdev/usehooks',
        'clsx',
        'd3-ease',
        'lodash',
        'react',
        'react-circular-progressbar',
        'react-dom',
      ],
      treeshake: {
        moduleSideEffects: 'no-external',
      },
    },
  },
});
