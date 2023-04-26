import { defineConfig, presetMini } from 'unocss'

export default defineConfig({
  presets: [
    presetMini({
      dark: 'media',
    }),
  ],
})