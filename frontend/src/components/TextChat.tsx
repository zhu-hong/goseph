import { Message } from '@/types'
import { type FC } from 'react'

export const TextChat: FC<{ msg: Message; className?: string }> = (props) => {
  return <div
    className={[props.className, 'nodrag bg-white dark:bg-black px-4 py-2 rounded whitespace-pre-wrap'].join(' ')}
    style={{
      'lineBreak': 'anywhere',
    }}
  >
    {props.msg.value}
  </div>
}
