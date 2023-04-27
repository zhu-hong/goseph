import { useEffect, useState } from 'react'
import { ChatInputBox } from './components/ChatInputBox'
import { resolveWS } from './ws';

export enum WebSocketState {
  Connecting,
  Open,
  Close,
}

export interface Message {
  type: 'text' | 'file';
  value: string;
}

let ws: WebSocket | null = null

export function App() {
  const [wsState, setWsState] = useState(WebSocketState.Connecting)
  const [messages, setMessages] = useState<Message[]>([])

  function onMessage(e: MessageEvent) {
    console.log(messages)
    setMessages([...messages, JSON.parse(e.data)])
  }
  
  useEffect(() => {
    resolveWS().then((websocket) => {
      ws = websocket
      ws.addEventListener('open', () => setWsState(WebSocketState.Open))
      ws.addEventListener('close', () => setWsState(WebSocketState.Close))
      ws.addEventListener('message', (e: MessageEvent) => onMessage(e))
    })
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