import { useEffect, useRef, useState } from 'react'
import { ChatInput } from './components/ChatInput'
import { resolveBaseUrl } from './utils'
import { ChatArea } from './components/ChatArea'
import { Message, WebSocketState } from './types'
import { WsState } from './components/WsState'
import { LocalAddr } from './components/LocalAddr'

let ws: WebSocket | null = null
let delayCloseState: unknown = null

export function App() {
  const [wsState, setWsState] = useState(WebSocketState.Connecting)
  const [messages, setMessages] = useState<Message[]>([])
  const chatAreaRef = useRef<HTMLDivElement>(null)

  const onMessage = (e: MessageEvent) => {
    const msg: Message = JSON.parse(e.data)
    setMessages((msgs) => [...msgs, msg])
  }
  const onOpen = () => {
    setWsState(() => WebSocketState.Open)

    if(delayCloseState === null) return

    clearTimeout(delayCloseState as number)
    delayCloseState = null
  }
  const onClose = () => {
    releaseWS()

    setWsState(() => WebSocketState.Connecting)

    if(delayCloseState !== null) {
      clearTimeout(delayCloseState as number)
      delayCloseState = null
    }

    delayCloseState = setTimeout(() => {
      setWsState(() => WebSocketState.Close)
      clearTimeout(delayCloseState as number)
      delayCloseState = null
    }, 1500)
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

  // 收到一条新消息，滑到底部
  useEffect(() => {
    const wrapper = chatAreaRef.current?.children[0]?.children
    wrapper?.[wrapper?.length-1]?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'end',
    })
  }, [messages])

  // 初始化websocket
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
    <LocalAddr />
    <WsState wsState={wsState} onReconnect={initWS} />
    <ChatArea ref={chatAreaRef} messages={messages} onSend={onSend} />
    <ChatInput wsState={wsState} onSend={onSend}  />
  </div>
}