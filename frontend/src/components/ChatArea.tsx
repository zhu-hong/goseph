import { useMemo, forwardRef } from 'react'
import { FileState, Message } from '@/types'
import { TextChat } from './TextChat'
import { generateMsgId, usrid } from '@/utils'
import type { PropsWithRef } from 'react'
import gif from '../assets/gif.gif?url'
import { FileChat } from './FileChat'

interface ChatAreaProps {
  messages: Message[];
  onSend: (message: Message) => void;
}

export const ChatArea = forwardRef<HTMLDivElement, PropsWithRef<ChatAreaProps>>(({ messages, onSend }, ref) => {
  const msgs = useMemo(() => {
    return messages.map((m) => {
      return {
        ...m,
        self: m.sender === usrid,
      }
    })
  }, [messages])

  function sendHello() {
    onSend({
      id: generateMsgId(),
      sender: usrid,
      type: 'file',
      value: gif,
      fileType: 'image/gif',
      progress: 100,
      state: FileState.SUCCESS,
    })
  }

  return <div className="flex-auto w-full chatarea text-black dark:text-white" ref={ref}>
    {
      msgs.length > 0
      ?
      <div className='max-w-640px h-full mx-auto flex flex-col'>
        {
          msgs.map((msg) => {
            return msg.type === 'text'
                   ? 
                   <TextChat key={msg.id} msg={msg} className={[msg.self ? 'self-end' : 'self-start', 'not-last:mb-4 first:mt-auto'].join(' ')} />
                   :
                   <FileChat key={msg.id} msg={msg} className={[msg.self ? 'self-end' : 'self-start', 'not-last:mb-4 first:mt-auto'].join(' ')} />
          })
        }
      </div>
      :
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <img src={gif} alt='gif' title='gif' className='inline-block cursor-pointer' onClick={sendHello} />
      </div>
    }
  </div>
})
