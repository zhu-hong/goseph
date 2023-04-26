import { ChatInputBox } from './components/ChatInputBox'
import { resolveIP } from './utils'

export function App() {
  resolveIP().then((IP) => {
    let ws = new WebSocket(`ws://${IP||window.location.hostname}:1122/api/v1/WS`)
    ws.addEventListener('error', () => {
      console.error('ws error')
    })
    ws.addEventListener('close', () => {
      console.log('ws close')
      ws.close()
      ws = new WebSocket(`ws://${IP||window.location.hostname}:1122/api/v1/WS`)
    })
    ws.addEventListener('open', () => {
      ws.send('ws open')
    })
    ws.addEventListener('message', (e: MessageEvent) => {
      console.log(e.data)
    })
  })


  return <div className="max-w-640px h-full overflow-hidden flex flex-col mx-auto pb-4 px-4 lt-sm:pb-2 lt-sm:px-2">
    <div className="flex-auto overflow-auto"></div>
    <ChatInputBox />
  </div>
}