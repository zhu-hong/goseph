import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import unocss from 'unocss/vite'
import nested from 'postcss-nested'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    unocss(),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, './src') },
      { find: '@wailsjs', replacement: resolve(__dirname, './wailsjs') },
    ],
  },
  css: {
    postcss: {
      plugins: [
        nested(),
      ],
    },
  },
})
