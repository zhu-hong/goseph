import { Message } from '@/types'
import { FC, useCallback } from 'react'

export const FileChat: FC<{ msg: Message & { url: string }; className?: string }> = ({ msg, className }) => {

  if(msg.fileType?.startsWith('image')) {
    return <img  src={msg.url} alt={msg.tip} title={msg.tip} className={[className].join(' ').trim()} />
  }

  const buildIcon = useCallback(() => {
    const type = msg.fileType!

    if(type.startsWith('audio')) {
      return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="m210.3 56.34l-80-24A8 8 0 0 0 120 40v108.26A48 48 0 1 0 136 184V50.75l69.7 20.91a8 8 0 1 0 4.6-15.32ZM88 216a32 32 0 1 1 32-32a32 32 0 0 1-32 32Z"></path></svg>
    } else if(type.startsWith('video')) {
      return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="m163.33 107l-48-32a6 6 0 0 0-9.33 5v64a6 6 0 0 0 9.33 5l48-32a6 6 0 0 0 0-10ZM118 132.79V91.21L149.18 112ZM216 42H40a14 14 0 0 0-14 14v112a14 14 0 0 0 14 14h176a14 14 0 0 0 14-14V56a14 14 0 0 0-14-14Zm2 126a2 2 0 0 1-2 2H40a2 2 0 0 1-2-2V56a2 2 0 0 1 2-2h176a2 2 0 0 1 2 2Zm12 40a6 6 0 0 1-6 6H32a6 6 0 0 1 0-12h192a6 6 0 0 1 6 6Z"/></svg>
    } else if(type.startsWith('text')) {
      return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="m213.66 82.34l-56-56A8 8 0 0 0 152 24H56a16 16 0 0 0-16 16v176a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V88a8 8 0 0 0-2.34-5.66ZM160 51.31L188.69 80H160ZM200 216H56V40h88v48a8 8 0 0 0 8 8h48v120Zm-32-80a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8Zm0 32a8 8 0 0 1-8 8H96a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8Z"/></svg> 
    } else if(type === 'application/pdf') {
      return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="M224 152a8 8 0 0 1-8 8h-24v16h16a8 8 0 0 1 0 16h-16v16a8 8 0 0 1-16 0v-56a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8ZM92 172a28 28 0 0 1-28 28h-8v8a8 8 0 0 1-16 0v-56a8 8 0 0 1 8-8h16a28 28 0 0 1 28 28Zm-16 0a12 12 0 0 0-12-12h-8v24h8a12 12 0 0 0 12-12Zm88 8a36 36 0 0 1-36 36h-16a8 8 0 0 1-8-8v-56a8 8 0 0 1 8-8h16a36 36 0 0 1 36 36Zm-16 0a20 20 0 0 0-20-20h-8v40h8a20 20 0 0 0 20-20ZM40 112V40a16 16 0 0 1 16-16h96a8 8 0 0 1 5.66 2.34l56 56A8 8 0 0 1 216 88v24a8 8 0 0 1-16 0V96h-48a8 8 0 0 1-8-8V40H56v72a8 8 0 0 1-16 0Zm120-32h28.69L160 51.31Z"></path></svg>
    } else if(['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(type)) {
      return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="M52 144H36a8 8 0 0 0-8 8v56a8 8 0 0 0 8 8h16a36 36 0 0 0 0-72Zm0 56h-8v-40h8a20 20 0 0 1 0 40Zm169.53-4.91a8 8 0 0 1 .25 11.31A30.06 30.06 0 0 1 200 216c-17.65 0-32-16.15-32-36s14.35-36 32-36a30.06 30.06 0 0 1 21.78 9.6a8 8 0 0 1-11.56 11.06A14.24 14.24 0 0 0 200 160c-8.82 0-16 9-16 20s7.18 20 16 20a14.24 14.24 0 0 0 10.22-4.66a8 8 0 0 1 11.31-.25ZM128 144c-17.65 0-32 16.15-32 36s14.35 36 32 36s32-16.15 32-36s-14.35-36-32-36Zm0 56c-8.82 0-16-9-16-20s7.18-20 16-20s16 9 16 20s-7.18 20-16 20Zm-80-80a8 8 0 0 0 8-8V40h88v48a8 8 0 0 0 8 8h48v16a8 8 0 0 0 16 0V88a8 8 0 0 0-2.34-5.66l-56-56A8 8 0 0 0 152 24H56a16 16 0 0 0-16 16v72a8 8 0 0 0 8 8Zm112-68.69L188.69 80H160Z"></path></svg>
    } else if(['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(type)) {
      return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="M156 208a8 8 0 0 1-8 8h-28a8 8 0 0 1-8-8v-56a8 8 0 0 1 16 0v48h20a8 8 0 0 1 8 8Zm-63.35-62.51a8 8 0 0 0-11.16 1.86L68 166.24l-13.49-18.89a8 8 0 1 0-13 9.3L58.17 180l-16.68 23.35a8 8 0 0 0 13 9.3L68 193.76l13.49 18.89a8 8 0 0 0 13-9.3L77.83 180l16.68-23.35a8 8 0 0 0-1.86-11.16Zm98.94 25.82c-4-1.16-8.14-2.35-10.45-3.84c-1.25-.82-1.23-1-1.12-1.9a4.54 4.54 0 0 1 2-3.67c4.6-3.12 15.34-1.72 19.82-.56a8 8 0 0 0 4.07-15.48c-2.11-.55-21-5.22-32.83 2.76a20.58 20.58 0 0 0-8.95 14.95c-2 15.88 13.65 20.41 23 23.11c12.06 3.49 13.12 4.92 12.78 7.59c-.31 2.41-1.26 3.33-2.15 3.93c-4.6 3.06-15.16 1.55-19.54.35a8 8 0 0 0-4.29 15.45a60.63 60.63 0 0 0 15.19 2c5.82 0 12.3-1 17.49-4.46a20.81 20.81 0 0 0 9.18-15.23c2.21-17.31-14.31-22.14-24.2-25ZM40 112V40a16 16 0 0 1 16-16h96a8 8 0 0 1 5.66 2.34l56 56A8 8 0 0 1 216 88v24a8 8 0 1 1-16 0V96h-48a8 8 0 0 1-8-8V40H56v72a8 8 0 0 1-16 0Zm120-32h28.68L160 51.31Z"></path></svg>
    } else if(['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(type)) {
      return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="M156 208a8 8 0 0 1-8 8h-28a8 8 0 0 1-8-8v-56a8 8 0 0 1 16 0v48h20a8 8 0 0 1 8 8Zm-63.35-62.51a8 8 0 0 0-11.16 1.86L68 166.24l-13.49-18.89a8 8 0 1 0-13 9.3L58.17 180l-16.68 23.35a8 8 0 0 0 13 9.3L68 193.76l13.49 18.89a8 8 0 0 0 13-9.3L77.83 180l16.68-23.35a8 8 0 0 0-1.86-11.16Zm98.94 25.82c-4-1.16-8.14-2.35-10.45-3.84c-1.25-.82-1.23-1-1.12-1.9a4.54 4.54 0 0 1 2-3.67c4.6-3.12 15.34-1.72 19.82-.56a8 8 0 0 0 4.07-15.48c-2.11-.55-21-5.22-32.83 2.76a20.58 20.58 0 0 0-8.95 14.95c-2 15.88 13.65 20.41 23 23.11c12.06 3.49 13.12 4.92 12.78 7.59c-.31 2.41-1.26 3.33-2.15 3.93c-4.6 3.06-15.16 1.55-19.54.35a8 8 0 0 0-4.29 15.45a60.63 60.63 0 0 0 15.19 2c5.82 0 12.3-1 17.49-4.46a20.81 20.81 0 0 0 9.18-15.23c2.21-17.31-14.31-22.14-24.2-25ZM40 112V40a16 16 0 0 1 16-16h96a8 8 0 0 1 5.66 2.34l56 56A8 8 0 0 1 216 88v24a8 8 0 1 1-16 0V96h-48a8 8 0 0 1-8-8V40H56v72a8 8 0 0 1-16 0Zm120-32h28.68L160 51.31Z"></path></svg>
    } else if(['application/x-bzip', 'application/x-bzip2', 'application/epub+zip', 'application/zip', 'application/x-7z-compressed', 'application/x-rar-compressed'].includes(type)) {
      return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="currentColor" d="M184 144h-16a8 8 0 0 0-8 8v56a8 8 0 0 0 16 0v-8h8a28 28 0 0 0 0-56Zm0 40h-8v-24h8a12 12 0 0 1 0 24Zm-48-32v56a8 8 0 0 1-16 0v-56a8 8 0 0 1 16 0Zm-40 56a8 8 0 0 1-8 8H56a8 8 0 0 1-7-12l25.16-44H56a8 8 0 0 1 0-16h32a8 8 0 0 1 7 12l-25.21 44H88a8 8 0 0 1 8 8ZM213.66 82.34l-56-56A8 8 0 0 0 152 24H56a16 16 0 0 0-16 16v72a8 8 0 0 0 16 0V40h88v48a8 8 0 0 0 8 8h48v16a8 8 0 0 0 16 0V88a8 8 0 0 0-2.34-5.66ZM160 80V51.31L188.69 80Z"/></svg>
    }
  
    return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><circle cx="11" cy="15.5" r="1.5" fill="currentColor"></circle><path fill="currentColor" d="M12 12h-2V8h2a2 2 0 0 0 0-4h-2a2.002 2.002 0 0 0-2 2v.5H6V6a4.005 4.005 0 0 1 4-4h2a4 4 0 0 1 0 8Z"></path><path fill="currentColor" d="M22.448 21.034a10.971 10.971 0 0 0-2.527-16.29l-.999 1.73A8.997 8.997 0 1 1 5 14H3a10.992 10.992 0 0 0 18.034 8.448L28.586 30L30 28.586Z"></path></svg>
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
