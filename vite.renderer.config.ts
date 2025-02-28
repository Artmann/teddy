import react from '@vitejs/plugin-react'
import path from 'path'
import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'

import { pluginExposeRenderer } from './vite.base.config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config
export default defineConfig(async (env) => {
  const forgeEnv = env as any
  const { root, mode, forgeConfigSelf } = forgeEnv
  const name = forgeConfigSelf.name ?? ''

  const tailwindcss = await import('@tailwindcss/vite')


  return {
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`
    },
    clearScreen: false,
    mode,
    plugins: [
      pluginExposeRenderer(name),
      react(),
      tailwindcss.default(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
      preserveSymlinks: true
    },
    root,
  } as UserConfig
})
