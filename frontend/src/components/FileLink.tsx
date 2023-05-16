import { BrowserOpenURL } from '@wailsjs/runtime/runtime'
import { type MouseEvent, type FC, type PropsWithChildren, useCallback } from 'react'

type FileLinkProps = PropsWithChildren<{
  url: string
  [x: string]: any
}>

export const FileLink: FC<FileLinkProps> = ({ url, children, ...rest }) => {
  const onClick = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    if(!inWails) return

    e.preventDefault()

    BrowserOpenURL(url)
  }, [url])

  return <a target='_blank' href={url} {...rest} onClick={onClick}>
    {
      children
    }
  </a>
}
