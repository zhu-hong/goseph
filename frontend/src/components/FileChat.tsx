import { Message } from '@/types'
import type { FC } from 'react'

export const FileChat: FC<{ msg: Message; className?: string }> = ({ msg, className }) => {
  console.log(msg.value)
  if(msg.fileType?.startsWith('image')) {
    return <img src={msg.value} alt={msg.tip} title={msg.tip} className={[className, 'max-w-208px'].join(' ')} />
  }

  return <div className={[className].join(' ')}></div>
}

