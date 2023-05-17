import { Message } from '@/types'
import { BrowserOpenURL } from '@wailsjs/runtime/runtime'
import { type MouseEvent, type FC, type PropsWithChildren, useCallback, type DragEvent } from 'react'

type FileLinkProps = PropsWithChildren<{
  url: string
  msg: Message
  [x: string]: any
}>

export const FileLink: FC<FileLinkProps> = ({ url, msg, children, ...rest }) => {
  const onDragStart = useCallback((e: DragEvent<HTMLAnchorElement>) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(msg))
  }, [msg])
  const onClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    if(!inWails) return

    e.preventDefault()

    BrowserOpenURL(url)
  }, [url])

  return <a target='_blank' href={url} {...rest} onClick={onClick} onDragStart={(e) => onDragStart(e)}>
    {
      children
    }
  </a>
}
