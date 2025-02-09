import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';
import { loadEnv } from 'vite'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    env: loadEnv('', process.cwd(), ''),
  }
})
