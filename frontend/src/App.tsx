import { useEffect, useState } from 'react'
import { ChatInputBox } from './components/ChatInputBox'
import { resolveWSURL } from './ws'
import { Message, WebSocketState } from './types'

let ws: WebSocket | null = null

export function App() {
  const [wsState, setWsState] = useState(WebSocketState.Connecting)
  const [messages, setMessages] = useState<Message[]>([])

  const onMessage = (e: MessageEvent) => setMessages((messages) => [...messages, JSON.parse(e.data)])
  const onOpen = () => setWsState(WebSocketState.Open)
  const onClose = () => setWsState(WebSocketState.Close)

  async function initWS(ip = '') {
    ws = new WebSocket(resolveWSURL(ip))
    ws.addEventListener('open', onOpen)
    ws.addEventListener('close', onClose)
    ws.addEventListener('message', onMessage)
  }
  
  useEffect(() => {
    initWS()

    return () => {
      ws!.removeEventListener('open', onOpen)
      ws!.removeEventListener('close', onClose)
      ws!.removeEventListener('message', onMessage)
    }
  }, [])

  function onSend(message: Message) {
    if(wsState !== WebSocketState.Open) return

    ws?.send(JSON.stringify(message))
  }

  return <div className="max-w-640px h-full overflow-hidden flex flex-col mx-auto pb-4 px-4 lt-sm:pb-2 lt-sm:px-2">
    <div className="flex-auto overflow-auto"></div>
    {
      messages.map((v, i) => <div key={i}>{v.value}</div>)
    }
    <ChatInputBox onSend={onSend} wsState={wsState} />
  </div>
}