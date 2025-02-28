import react from '@vitejs/plugin-react'
import path from 'path'
import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'

import { pluginExposeRenderer } from './vite.base.config'

// https://vitejs.dev/config
export default defineConfig(async (env) => {
  const forgeEnv = env as any
  const { root, mode, forgeConfigSelf } = forgeEnv
  const name = forgeConfigSelf.name ?? ''

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
    root
  } as UserConfig
})
