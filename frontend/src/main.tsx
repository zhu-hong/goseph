import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { App } from '@/App'

import '@/assets/preset.css'
import '@/assets/style.css'

import 'uno.css'

export const inWails = window.wails != undefined
console.log(`%cinWails: ${inWails}`, 'color:#f07c82;font-size:16px;')

if(inWails) {
  document.title = `${document.title} | wails`
}

createRoot(document.getElementById('goseph')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
