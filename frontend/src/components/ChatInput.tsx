import { FileState, Message, WebSocketState } from '@/types';
import { generateMsgId, hasher, usrid } from '@/utils';
import axios from 'axios';
import { ChangeEvent, FC, FormEvent, useMemo } from 'react'
import { useState } from 'react'
import type { AxiosProgressEvent } from 'axios'

const CHUNK_SIZE = 1024 * 1024 * 1024 / 4
const baseURL = `http://${window.location.hostname}:1122/api/v1`

const request = axios.create({
  baseURL,
  timeout: 10000,
})

interface ChatInputProps {
  onSend: (message: Message) => void;
  wsState: WebSocketState;
}

export const ChatInput: FC<ChatInputProps> = ({ onSend, wsState }) => {
  const [text, setText] = useState('')

  function onTextChange(e: ChangeEvent<HTMLInputElement>) {
    setText(e.target.value)
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]

    if(!file) return

    e.target.value = ''

    const msgId = generateMsgId()

    if(file.size <= CHUNK_SIZE) {
      uploadCompleteFile(file, msgId)
      return
    }
  }

  async function uploadCompleteFile(file: File, msgId: string) {
    onSend({
      id: msgId,
      sender: usrid,
      type: 'file',
      value: '',
      fileType: file.type,
      progress: 0,
      state: FileState.HASHING,
      tip: file.name,
    })

    const hash = await hasher(file)

    const { data: checkRes } = await request('/CheckFile', {
      params: {
        hash: hash,
        fileName: file.name,
      },
    })

    // 文件已存在
    if(checkRes.exist === 1) {
      onSend({
        id: msgId,
        sender: usrid,
        type: 'file',
        value: `${baseURL}/File/${checkRes.file}`,
        fileType: file.type,
        progress: 100,
        state: FileState.SUCCESS,
        tip: file.name,
      })
      return
    }

    onSend({
      id: msgId,
      sender: usrid,
      type: 'file',
      value: '',
      fileType: file.type,
      progress: 0,
      state: FileState.UPLOADING,
      tip: file.name,
    })

    const fd = new FormData()
    fd.append('file', file)
    fd.append('hash', hash as string)
    fd.append('fileName', file.name)
    const { data: uploadRes } = await request.post('/File', fd, {
      onUploadProgress(e: AxiosProgressEvent) {
        onSend({
          id: msgId,
          sender: usrid,
          type: 'file',
          value: '',
          fileType: file.type,
          progress: Math.round(e.loaded / (e.total || file.size) * 100),
          state: FileState.UPLOADING,
          tip: file.name,
        })
      },
    })
    onSend({
      id: msgId,
      sender: usrid,
      type: 'file',
      value: `${baseURL}/File/${uploadRes.file}`,
      fileType: file.type,
      progress: 100,
      state: FileState.SUCCESS,
      tip: file.name,
    })
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if(text.length === 0) return

    onSend({
      id: generateMsgId(),
      sender: usrid,
      type: 'text',
      value: text,
    })
    setText('')
  }

  const disabled = useMemo(() => {
    return text.length === 0 || wsState !== WebSocketState.Open
  }, [text.length, wsState])

  return  <div className="max-w-640px flex-none w-full mt-2 flex justify-between items-center dark:text-white">
    <form
      onSubmit={onSubmit}
      className="flex-auto rounded-lg overflow-hidden h-48px shadow dark:shadow-dark-900 flex justify-between items-center bg-gray-100 dark:bg-dark-700"
    >
      <input
        disabled={wsState !== WebSocketState.Open}
        value={text}
        onChange={onTextChange}
        placeholder="🤏"
        type="text"
        className="flex-auto bg-transparent h-full pl-4 rounded-lg border border-transparent focus:(outline-none)"
        enterKeyHint="send"
      />
      <button disabled={disabled} title='发送' type="submit" className='flex-none w-38px h-38px rounded-full grid place-items-center transition  mx-1 text-gray-400 not-disabled:hover:(text-rose-400 bg-white dark:bg-black)'>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16"><path fill="currentColor" d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26l.001.002l4.995 3.178l3.178 4.995l.002.002l.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215l7.494-7.494l1.178-.471l-.47 1.178Z"/></svg>
      </button>
    </form>
    <input type="file" name="upload" id="upload" className='hidden' disabled={wsState !== WebSocketState.Open} onChange={onFileChange} />
    <button
      disabled={wsState !== WebSocketState.Open}
      title='选择文件' type='button'
      className="flex-none w-48px h-48px ml-2 rounded-full grid place-items-center text-gray-700 dark:text-gray-400 transition not-disabled:hover:(bg-white cursor-pointer text-rose-400 dark:bg-black)"
    >
      <label htmlFor='upload'>
        <svg xmlns="http://www.w3.org/2000/svg" className='transform rotate-35' width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>
      </label>
    </button>
  </div>
}
