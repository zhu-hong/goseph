import { createRoot } from 'react-dom/client'
import App from './App'

const inWails = window.wails != undefined
console.log(`%cinWails: ${inWails}`, 'color:#f07c82;font-size:16px;')

if(inWails) {
  document.title = `${document.title} | wails`
}

createRoot(document.getElementById('root')!).render(App())
