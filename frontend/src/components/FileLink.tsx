import { BASE_URL } from '@/const'
import { BrowserOpenURL } from '@wailsjs/runtime/runtime'
import type { MouseEvent, FC, PropsWithChildren } from 'react'

interface FileLinkProps extends PropsWithChildren {
  url: string
  [x: string]: any
}

function onClick(e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>, url: string) {
  if(!inWails) return

  e.preventDefault()
  BrowserOpenURL(url === 'hello.gif' ? `http://${BASE_URL}/z/${url}` : url)
}

export const FileLink: FC<FileLinkProps> = ({ url, children, ...rest }) => {
  return <a target='_blank' href={url} {...rest} onClick={(e) => onClick(e, url)}>
    {
      children
    }
  </a>
}
