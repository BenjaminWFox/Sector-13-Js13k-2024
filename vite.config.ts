import { js13kViteConfig } from 'js13k-vite-plugins';
import { defineConfig } from 'vite';

export default defineConfig({
  ...js13kViteConfig(),
  server: {
    host: '0.0.0.0'
  }
});
