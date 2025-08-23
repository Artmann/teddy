import react from '@vitejs/plugin-react'
import path from 'path'
import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'

import { pluginExposeRenderer } from './vite.base.config'

// https://vitejs.dev/config
export default defineConfig(async (env) => {
  const forgeEnv = env as any
  const { root, mode, forgeConfigSelf } = forgeEnv
  const name = forgeConfigSelf?.name ?? ''

  return {
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`
    },
    clearScreen: false,
    mode,
    plugins: [pluginExposeRenderer(name), react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
      preserveSymlinks: true
    },
    root,
    test: {
      coverage: {
        exclude: [
          '**/node_modules/**',
          '**/test-setup.ts',
          '**/*.config.ts',
          '**/*.config.js',
          '**/*.config.mts',
          '**/src/app/components/ui/**',
          '**/dist/**',
          '**/.vite/**',
          '**/coverage/**',
          '**/*.d.ts',
          '**/forge.config.js',
          '**/electron.vite.config.ts',
          '**/src/main.ts',
          '**/src/preload.ts',
          '**/src/renderer.ts'
        ],
        reporter: ['text', 'html', 'json']
      },
      environment: 'jsdom',
      globals: true,
      setupFiles: './test-setup.ts',
      environmentOptions: {
        jsdom: {
          resources: 'usable'
        }
      }
    }
  } as UserConfig
})
