import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { App } from '@/App'

import '@/assets/preset.css'
import '@/assets/style.css'

import 'uno.css'

createRoot(document.getElementById('goseph')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
