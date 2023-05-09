import { useMemo, forwardRef, MouseEvent } from 'react'
import { Message } from '@/types'
import { TextChat } from './TextChat'
import { genMsgId } from '@/utils'
import { BASE_URL, USRID } from '@/const'
import type { PropsWithRef } from 'react'
import { FileChat } from './FileChat'
import { BrowserOpenURL } from '@wailsjs/runtime/runtime'

interface ChatAreaProps {
  messages: Message[];
  onSend: (message: Message) => void;
}

export const ChatArea = forwardRef<HTMLDivElement, PropsWithRef<ChatAreaProps>>(({ messages, onSend }, ref) => {
  const msgs = useMemo(() => {
    return messages.map((m) => {
      return {
        ...m,
        self: m.sender === USRID,
      }
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
    BrowserOpenURL(filename === 'hello.gif' ? `http://${BASE_URL}/z/${filename}` : `http://${BASE_URL}/api/v1/File/${filename}`)
  }

  return <div className="flex-auto w-full chatarea text-black dark:text-white pt-2" ref={ref}>
    {
      msgs.length > 0
      ?
      <div className='max-w-640px h-full mx-auto flex flex-col'>
        {
          msgs.map((msg) => {
            return msg.type === 'text' ? 
            <TextChat key={msg.id} msg={msg} className={[msg.self ? 'self-end' : 'self-start', 'not-last:mb-4 first:mt-auto'].join(' ')} /> :
            <a
              onClick={(e) => onFileChatClick(e, msg.value)}
              href={msg.value} target='_blank'
              key={msg.id} className={[msg.self ? 'self-end' : 'self-start', 'not-last:mb-4 first:mt-auto nodrag'].join(' ')}
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
})
