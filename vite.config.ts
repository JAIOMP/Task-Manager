import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'lcov', 'json'],
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'tests/**/*',
        'src/main.ts',
        'src/stories/*',
        'src/configs/**/*',
        'src/App.vue',
        'src/shims-vue.d.ts'
      ],
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
