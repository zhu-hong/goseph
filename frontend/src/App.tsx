import { useEffect, useRef, useState } from 'react'
import { ChatInput } from './components/ChatInput'
import { resolveBaseUrl } from './utils'
import { ChatArea } from './components/ChatArea'
import { Message, WebSocketState } from './types'
import { WsState } from './components/WsState'

let ws: WebSocket | null = null

export function App() {
  const [wsState, setWsState] = useState(WebSocketState.Connecting)
  const [messages, setMessages] = useState<Message[]>([])

  const onMessage = (e: MessageEvent) => {
    const msg: Message = JSON.parse(e.data)
    setMessages((oldMsgs) => [...oldMsgs, msg])
  }
  const onOpen = () => setWsState(() => WebSocketState.Open)
  const onClose = () => {
    releaseWS()
    setWsState(() => WebSocketState.Close)
  }

  async function initWS() {
    setWsState(WebSocketState.Connecting)
    if(ws === null || wsState === WebSocketState.Close) {
      ws = new WebSocket(`ws://${resolveBaseUrl()}/api/v1/WS`)
    }
    ws.addEventListener('open', onOpen)
    ws.addEventListener('close', onClose)
    ws.addEventListener('message', onMessage)
  }

  function releaseWS() {
    ws!.removeEventListener('open', onOpen)
    ws!.removeEventListener('close', onClose)
    ws!.removeEventListener('message', onMessage)
    if(ws!.readyState === ws!.OPEN) {
      ws!.close(1000)
    }
  }

  useEffect(() => {
    // 收到一条新消息，滑到底部
    const wrapper = chatAreaRef.current?.children[0]?.children
    wrapper?.[wrapper?.length-1]?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'end',
    })
  }, [messages])
  
  const chatAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initWS()

    return () => {
      releaseWS()
    }
  }, [])

  function onSend(message: Message) {
    if(wsState !== WebSocketState.Open) return

    ws!.send(JSON.stringify(message))
  }

  return <div
    className="w-full h-full overflow-hidden flex flex-col items-center mx-auto pb-4 px-4 lt-sm:pb-2 lt-sm:px-2"
  >
    <WsState wsState={wsState} onReconnect={initWS} />
    <ChatArea messages={messages} onSend={onSend} ref={chatAreaRef} />
    <ChatInput onSend={onSend} wsState={wsState} />
  </div>
}