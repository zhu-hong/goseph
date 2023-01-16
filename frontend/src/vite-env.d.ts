/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  export default DefineComponent<{}, {}>
}

interface window {
  runtime: any
}