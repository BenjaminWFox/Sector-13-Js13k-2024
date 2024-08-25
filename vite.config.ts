import { js13kViteConfig } from 'js13k-vite-plugins';
import { defineConfig } from 'vite';

export default defineConfig({
  ...js13kViteConfig({
    terserOptions: {
      mangle: {
        module: true,
        toplevel: true,
      },
      module: true,
      toplevel: true,
    },
  })
});
