import { FC, useMemo } from 'react'
import { Message } from '@/types'

export const ChatArea: FC<{ messages: Message[] }> = ({ messages }) => {
  const msgs = useMemo(() => {
    return messages.map((m) => m)
  }, [messages])

  return <div className="flex-auto overflow-auto flex flex-col justify-end">
    {
      msgs.map((m, i) => <div key={i} className='mb-4 self-end'>{ m.value }</div>)
    }
  </div>
}
