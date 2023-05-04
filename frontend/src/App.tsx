import { useEffect, useRef, useState } from 'react'
import { ChatInput } from './components/ChatInput'
import { resolveWSURL } from './utils'
import { Message, WebSocketState } from './types'
import { ChatArea } from './components/ChatArea'

let ws: WebSocket | null = null

export function App() {
  const [wsState, setWsState] = useState(WebSocketState.Connecting)
  const [messages, setMessages] = useState<Message[]>([])

  const onMessage = (e: MessageEvent) => {
    const msg: Message = JSON.parse(e.data)
    setMessages((oldMsgs) => {
      const index = oldMsgs.findIndex((m) => m.id === msg.id)
      if(index !== -1) {
        // 更新状态或进度的消息
        oldMsgs.splice(index, 1, msg)
        return oldMsgs
      } else {
        return [...oldMsgs, msg]
      }
    })
  }
  const onOpen = () => setWsState(WebSocketState.Open)
  const onClose = () => {
    setWsState(WebSocketState.Close)
  }

  async function initWS() {
    if(ws === null) {
      ws = new WebSocket(resolveWSURL())
    }
    ws.addEventListener('open', onOpen)
    ws.addEventListener('close', onClose)
    ws.addEventListener('message', onMessage)
  }

  function releaseWS() {
    ws!.removeEventListener('open', onOpen)
    ws!.removeEventListener('close', onClose)
    ws!.removeEventListener('message', onMessage)
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

    ws?.send(JSON.stringify(message))
  }

  return <div className="w-full h-full overflow-hidden flex flex-col items-center mx-auto pb-4 px-4 lt-sm:pb-2 lt-sm:px-2">
    <ChatArea messages={messages} onSend={onSend} ref={chatAreaRef} />
    <ChatInput onSend={onSend} wsState={wsState} />
  </div>
}