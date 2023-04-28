import { FC, useMemo } from 'react'
import { Message } from '@/types'

export const ChatArea: FC<{ messages: Message[] }> = ({ messages }) => {
  const msgs = useMemo(() => {
    return messages.map((m) => m)
  }, [messages])

  return <div className="flex-auto w-full overflow-auto flex flex-col">
    {
      msgs.map((m, i) => <div key={i} className='mb-4 self-end nodrag first:mt-auto'>{ m.value }</div>)
    }
  </div>
}
