import { Message } from '@/types'
import type { FC } from 'react'

export const FileChat: FC<{ msg: Message; className?: string }> = ({ msg, className }) => {
  if(msg.fileType?.startsWith('image')) {
    return <img src={msg.value} alt={msg.tip} title={msg.tip} className={[className, 'max-w-208px'].join(' ').trim()} />
  }

  return <div className={[className].join(' ').trim()}></div>
}
