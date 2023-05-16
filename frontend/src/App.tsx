import { useEffect } from 'react'
import { ChatInput } from './components/ChatInput'
import { BASE_URL } from '@/const'
import { ChatArea } from './components/ChatArea'
import { Message, WebSocketState } from './types'
import { WsState } from './components/WsState'
import { LocalAddr } from './components/LocalAddr'
import { useWsStore } from './store'

let ws: WebSocket | null = null
let delayCloseState: unknown = null

export function App() {
  const { wsState, setWsState, setMessages } = useWsStore()

  const onMessage = (e: MessageEvent) => {
    try {
      const msg: Message = JSON.parse(e.data)
      setMessages(msg)
    } catch (error) {
      console.error(`msg parse error: ${error}`)
    }
  }
  const onOpen = () => {
    setWsState(WebSocketState.Open)

    if(delayCloseState === null) return

    clearTimeout(delayCloseState as number)
    delayCloseState = null
  }
  const onClose = () => {
    releaseWS()

    setWsState(WebSocketState.Connecting)

    if(delayCloseState !== null) {
      clearTimeout(delayCloseState as number)
      delayCloseState = null
    }

    delayCloseState = setTimeout(() => {
      setWsState(WebSocketState.Close)
      clearTimeout(delayCloseState as number)
      delayCloseState = null
    }, 1500)
  }
  const onError = (error: Event) => {
    console.error(`websocket error: `, error)
  }

  async function initWS() {
    setWsState(WebSocketState.Connecting)
    if(ws === null || wsState === WebSocketState.Close) {
      ws = new WebSocket(`ws://${BASE_URL}/api/WS`)
    }
    ws.addEventListener('open', onOpen)
    ws.addEventListener('close', onClose)
    ws.addEventListener('message', onMessage)
    ws.addEventListener('error', onError)
  }

  function releaseWS() {
    ws!.removeEventListener('open', onOpen)
    ws!.removeEventListener('close', onClose)
    ws!.removeEventListener('message', onMessage)
    ws!.removeEventListener('error', onError)
    if(ws!.readyState === ws!.OPEN) {
      ws!.close(1000)
    }
  }

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
    className="w-full h-full overflow-hidden mx-auto"
  >
    <LocalAddr />
    <WsState onReconnect={initWS} />
    <ChatArea onSend={onSend} />
    <ChatInput onSend={onSend}  />
  </div>
}