import { Message } from '@/types'
import { buildFileIcon } from '@/utils';
import { FC, useCallback } from 'react'

export const FileChat: FC<{ msg: Message & { url: string }; className?: string }> = ({ msg, className }) => {

  if(msg.fileType?.startsWith('image')) {
    return <img  src={msg.url} alt={msg.tip} title={msg.tip} className={[className].join(' ').trim()} />
  }

  const buildIcon = useCallback(() => {
    return buildFileIcon(msg.fileType!)    
  }, [msg.fileType])


  return <div  className={[className, 'nodrag bg-white dark:bg-black px-4 py-2 rounded flex justify-between items-center gap-2'].join(' ').trim()}>
    <div className='flex-none text-3xl cursor-default' onClick={(e) => e.preventDefault()}>
      { buildIcon() }
    </div>
    <span className='underline underline-current hover:text-rose-400 transition' style={{
      'lineBreak': 'anywhere',
      'textUnderlineOffset': '.25rem',
    }}>{msg.tip}</span>
  </div>
}
