import { useEffect, useRef, useState } from 'react'
import { ChatInput } from './components/ChatInput'
import { resolveBaseUrl } from './utils'
import { ChatArea } from './components/ChatArea'
import { Message, WebSocketState } from './types'

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
    setWsState(() => WebSocketState.Close)
  }

  async function initWS() {
    if(ws === null) {
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

  function resolveStateComponent(state: WebSocketState) {
    if(state === WebSocketState.Open) {
      return <svg xlinkTitle='websocket已连接' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" className='text-green-400'><mask id="ipSCorrect0"><path fill="#fff" fillRule="evenodd" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="m4 24l5-5l10 10L39 9l5 5l-25 25L4 24Z" clipRule="evenodd"></path></mask><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSCorrect0)"></path></svg>
    } else if (state === WebSocketState.Close) {
      return <svg xlinkTitle='websocket连接已断开' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512" className='text-red-400 cursor-pointer'><path d="M437.5 386.6L306.9 256l130.6-130.6c14.1-14.1 14.1-36.8 0-50.9-14.1-14.1-36.8-14.1-50.9 0L256 205.1 125.4 74.5c-14.1-14.1-36.8-14.1-50.9 0-14.1 14.1-14.1 36.8 0 50.9L205.1 256 74.5 386.6c-14.1 14.1-14.1 36.8 0 50.9 14.1 14.1 36.8 14.1 50.9 0L256 306.9l130.6 130.6c14.1 14.1 36.8 14.1 50.9 0 14-14.1 14-36.9 0-50.9z" fill="currentColor"></path></svg>
    } else {
      return <svg xlinkTitle='正在连接websocket' width="1em" height="1em" viewBox="0 0 24 24" className='text-yellow-400' xmlns="http://www.w3.org/2000/svg"><circle fill='currentColor' cx="4" cy="12" r="3" opacity="1"><animate id="spinner_qYjJ" begin="0;spinner_t4KZ.end-0.25s" attributeName="opacity" dur="0.75s" values="1;.2" fill="freeze"/></circle><circle fill='currentColor' cx="12" cy="12" r="3" opacity=".4"><animate begin="spinner_qYjJ.begin+0.15s" attributeName="opacity" dur="0.75s" values="1;.2" fill="freeze"/></circle><circle fill='currentColor' cx="20" cy="12" r="3" opacity=".3"><animate id="spinner_t4KZ" begin="spinner_qYjJ.begin+0.3s" attributeName="opacity" dur="0.75s" values="1;.2" fill="freeze"/></circle></svg>
    }
  }

  return <div className="w-full h-full overflow-hidden flex flex-col items-center mx-auto pb-4 px-4 lt-sm:pb-2 lt-sm:px-2">
    <div className='absolute top-0 right-0 p-2'>
      {resolveStateComponent(wsState)}
    </div>
    <ChatArea messages={messages} onSend={onSend} ref={chatAreaRef} />
    <ChatInput onSend={onSend} wsState={wsState} />
  </div>
}