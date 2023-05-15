import { useMemo, MouseEvent, FC, useEffect, useRef } from 'react'
import { Message } from '@/types'
import { TextChat } from './TextChat'
import { genMsgId } from '@/utils'
import { BASE_URL, USRID } from '@/const'
import { FileChat } from './FileChat'
import { BrowserOpenURL } from '@wailsjs/runtime/runtime'
import { useWsStore } from '@/store'

interface ChatAreaProps {
  onSend: (message: Message) => void
}

export const ChatArea: FC<ChatAreaProps> = ({ onSend }) => {
  const { messages } = useWsStore()

  const chatAreaRef = useRef<HTMLDivElement>(null)

  const msgs = useMemo(() => {
    return messages.map((m) => {
      return {
        ...m,
        self: m.sender === USRID,
      }
    })
  }, [messages])

  // 收到一条新消息，滑到底部
  useEffect(() => {
    const wrapper = chatAreaRef.current?.children[0]?.children
    wrapper?.[wrapper?.length-1]?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'end',
    })
  }, [messages])

  function sendHello() {
    onSend({
      id: genMsgId(),
      sender: USRID,
      type: 'file',
      value: 'hello.gif',
      fileType: 'image/gif',
      tip: 'hello.gif',
    })
  }
  
  function onFileChatClick(e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>, filename: string) {
    if(!inWails) return

    e.preventDefault()
    BrowserOpenURL(filename === 'hello.gif' ? `http://${BASE_URL}/z/${filename}` : `http://${BASE_URL}/api/File/${filename}`)
  }

  return <div className="flex-auto w-full chatarea text-black dark:text-white pt-2" ref={chatAreaRef}>
    {
      msgs.length > 0
      ?
      <div className='max-w-640px h-full mx-auto flex flex-col'>
        {
          msgs.map((msg) => {
            return msg.type === 'text'
            ? 
            <TextChat key={msg.id} msg={msg} className={[msg.self ? 'self-end mr-1 ml-10' : 'self-start mr-10 ml-1', 'not-last:mb-4 first:mt-auto'].join(' ')} />
            :
            <a
              onClick={(e) => onFileChatClick(e, msg.value)}
              href={msg.value} target='_blank'
              key={msg.id} className={[msg.self ? 'self-end mr-1 ml-10' : 'self-start mr-10 ml-1', 'not-last:mb-4 first:mt-auto nodrag'].join(' ')}
            >
              <FileChat msg={msg} />
            </a>
          })
        }
      </div>
      :
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <img src='./hello.gif' alt='hello' title='打个招呼吧' className='inline-block' onClick={sendHello} />
      </div>
    }
  </div>
}
