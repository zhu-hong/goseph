import { useMemo, type FC, useEffect, useRef, type DragEvent } from 'react'
import { Message } from '@/types'
import { TextChat } from './TextChat'
import { genFileMsg, genFilePath, genMsgId } from '@/utils'
import { BASE_URL, USRID } from '@/const'
import { FileChat } from './FileChat'
import { useWsStore } from '@/store'
import { FileLink } from './FileLink'

interface ChatAreaProps {
  onSend: (message: Message) => void
  filesChannel: (files: FileList) => void
}

let scrollTimeout: unknown = null

export const ChatArea: FC<ChatAreaProps> = ({ onSend, filesChannel }) => {
  const { messages } = useWsStore()

  const chatAreaRef = useRef<HTMLDivElement>(null)

  const msgs = useMemo(() => {
    return messages.map((m) => {
      return {
        ...m,
        self: m.sender === USRID,
        url: m.type === 'text' ? '' : m.value === 'hello.gif' ? `http://${BASE_URL}/z/hello.gif` : genFilePath(m.value),
      }
    })
  }, [messages])

  // 收到一条新消息，滑到底部
  useEffect(() => {
    if(scrollTimeout !== null) {
      clearTimeout(scrollTimeout as number)
      scrollTimeout = null
    }
    scrollTimeout = setTimeout(() => {
      const wrapper = chatAreaRef.current?.children[0]?.children
      wrapper?.[wrapper?.length-1]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
      clearTimeout(scrollTimeout as number)
      scrollTimeout = null
    }, 200)

    return () => {
      if(scrollTimeout === null) return

      clearTimeout(scrollTimeout as number)
      scrollTimeout = null
    }
  }, [messages])

  function sendHello() {
    onSend(genFileMsg({
      file: 'hello.gif',
      fileType: 'image/gif',
      tip: 'hello.gif',
    }))
  }
  function onDragover(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.currentTarget.classList.add('dragover')
  }
  function onDragleave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.currentTarget.classList.remove('dragover')
  }
  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.currentTarget.classList.remove('dragover')

    const files = e.dataTransfer.files

    if(files.length !== 0) {
      filesChannel(files)
      return
    }

    let dragData: Message | string = e.dataTransfer.getData('text/plain')

    if(dragData.trim() === '') return

    try {
      dragData = JSON.parse(dragData)
      onSend({
        ...dragData as Message,
        id: genMsgId(),
        sender: USRID,
      })
    } catch (error) {
      console.error('parse dropData error', error)
    }
  }

  return <div
    className="w-full h-full chatarea text-black dark:text-white relative"
    ref={chatAreaRef}
    onDragOver={(e) => onDragover(e)}
    onDragLeave={(e) => onDragleave(e)}
    onDrop={(e) => onDrop(e)}
  >
    {
      msgs.length > 0
      ?
      <div className='max-w-640px h-full mx-auto flex flex-col pt-2'>
        {
          msgs.map((msg) => {
            return msg.type === 'text'
            ?
            <TextChat key={msg.id} msg={msg} className={[msg.self ? 'self-end mr-1 ml-10' : 'self-start mr-10 ml-1', 'not-last:mb-4 first:mt-auto'].join(' ')} />
            :
            <FileLink url={msg.url} key={msg.id} msg={msg} className={[msg.self ? 'self-end mr-1 ml-10' : 'self-start mr-10 ml-1', 'not-last:mb-4 first:mt-auto nodrag'].join(' ')}>
              <FileChat msg={msg} />
            </FileLink>
          })
        }
        {/* chatinput placeholder */}
        <div className='h-64px flex-none'></div>
      </div>
      :
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <img draggable={false} src='./hello.gif' alt='hello' title='打个招呼吧' className='inline-block nodrag' onClick={sendHello} />
      </div>
    }

    <div className='fixed w-full h-full top-0 left-0 chatarea-placeholder grid place-items-center text-xl text-rose-400'>松手发送</div>

  </div>
}
