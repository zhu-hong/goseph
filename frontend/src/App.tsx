import { useEffect } from 'react'
import { ChatInput } from './components/ChatInput'
import { BASE_URL } from '@/const'
import { ChatArea } from './components/ChatArea'
import { Message, WebSocketState } from './types'
import { WsState } from './components/WsState'
import { LocalAddr } from './components/LocalAddr'
import { useWsStore } from './store'
import { genFileMsg, mergeFile, hasher, checkFile, uploadFile } from '@/utils'
import { createRunhub } from './utils/runhub'
import pLimit from 'p-limit'
import { CHUNK_SIZE } from '@/const'

const enqueue = createRunhub()

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

  function filesChannel(files: FileList) {
    Array.from(files!).forEach(async (file) => {
      if(file.size <= CHUNK_SIZE) {
        enqueue(async () => await uploadSingleFile(file))
      } else {
        enqueue(async () => await uploadSplitFile(file))
      }
    })
  }

  async function uploadSingleFile(file: File) {
    const hash = await hasher(file)

    const checkRes = await checkFile({
      hash,
      fileName: file.name,
    })
    
    if(checkRes.exist) {
      onSend(genFileMsg({
        fileType: file.type,
        file: checkRes.file,
        tip: file.name,
      }))
      return
    }

    const fd = new FormData()
    fd.append('file', file)
    fd.append('hash', hash)
    const ulRes = await uploadFile(fd)

    onSend(genFileMsg({
      fileType: file.type,
      file: ulRes.file,
      tip: file.name,
    }))
  }

  async function uploadSplitFile(file: File) {
    const chunksCount = Math.ceil(file.size / CHUNK_SIZE)
    const chunks = []
    const chunksForHash = []

    for (let index = 0; index < chunksCount; index++) {
      const chunk = file.slice(CHUNK_SIZE * index, CHUNK_SIZE * (index + 1), file.type)
      chunks.push(chunk)
      if (index === 0 || index === chunksCount - 1) {
        chunksForHash.push(chunk)
      } else {
        let center = Math.ceil(chunk.size / 2)
        chunksForHash.push(chunk.slice(0, 1024 * 2, file.type))
        chunksForHash.push(chunk.slice(center - 1024, center + 1024, file.type))
        chunksForHash.push(chunk.slice(chunk.size - 1024 * 2, chunk.length, file.type))
      }
    }

    const hash = await hasher(new Blob(chunksForHash))

    const checkRes = await checkFile({
      hash,
      fileName: file.name,
    })

    if(checkRes.exist) {
      onSend(genFileMsg({
        fileType: file.type,
        file: checkRes.file,
        tip: file.name,
      }))
      return
    }

    const limit = pLimit(5)
    const reqs = chunks.map((chunk, index) => {
      if(checkRes.chunks.includes(index)) return Promise.resolve('')

      return limit(async () => {
        const fd = new FormData()
        fd.append('file', chunk)
        fd.append('hash', hash)
        fd.append('index', index.toString())

        await uploadFile(fd)
      })
    })

    await Promise.all(reqs)

    const { file: fileName } = await mergeFile({
      hash,
      fileName: file.name,
    })

    onSend(genFileMsg({
      file: fileName,
      fileType: file.type,
      tip: file.name,
    }))
  }

  return <div
    className="w-full h-full overflow-hidden mx-auto"
  >
    <div className='fixed top-0 right-0 flex items-center z-5'>
      <LocalAddr />
      <WsState onReconnect={initWS} />
    </div>

    <ChatArea onSend={onSend} filesChannel={filesChannel} />
    <ChatInput onSend={onSend} filesChannel={filesChannel}  />
  </div>
}