import { Message, WebSocketState } from '@/types'
import { useState, type ChangeEvent, type FC, type FormEvent, useEffect, useMemo, useRef, type ClipboardEvent } from 'react'
import { CHUNK_SIZE } from '@/const'
import { useWsStore } from '@/store';
import { hasher, checkFile, uploadFile, genTextMsg, genFileMsg, mergeFile } from '@/utils';
import { createRunhub } from '@/utils/runhub'
import pLimit from 'p-limit'

const enqueue = createRunhub()

interface ChatInputProps {
  onSend: (message: Message) => void
}

export const ChatInput: FC<ChatInputProps> = ({ onSend }) => {
  const { wsState } = useWsStore()

  const [text, setText] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  function onTextChange(e: ChangeEvent<HTMLInputElement>) {
    setText(e.target.value)
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files

    if(files === null || files.length === 0) return

    filesChannel(files!)
    
    e.target.value = ''
  }

  function filesChannel(files: FileList) {
    Array.from(files!).forEach(async (file) => {
      if(file.size <= CHUNK_SIZE) {
        enqueue(async () => await uploadSingleFile(file))
      } else {
        enqueue(async () => await uploadSplitFile(file))
      }
    })
  }

  async function uploadSingleFile(file: File) {
    const hash = await hasher(file)

    const checkRes = await checkFile({
      hash,
      fileName: file.name,
    })
    
    if(checkRes.exist) {
      onSend(genFileMsg({
        fileType: file.type,
        file: checkRes.file,
        tip: file.name,
      }))
      return
    }

    const fd = new FormData()
    fd.append('file', file)
    fd.append('hash', hash)
    const ulRes = await uploadFile(fd)

    onSend(genFileMsg({
      fileType: file.type,
      file: ulRes.file,
      tip: file.name,
    }))
  }

  async function uploadSplitFile(file: File) {
    const chunksCount = Math.ceil(file.size / CHUNK_SIZE)
    const chunks = []
    const chunksForHash = []

    for (let index = 0; index < chunksCount; index++) {
      const chunk = file.slice(CHUNK_SIZE * index, CHUNK_SIZE * (index + 1), file.type)
      chunks.push(chunk)
      if (index === 0 || index === chunksCount - 1) {
        chunksForHash.push(chunk)
      } else {
        let center = Math.ceil(chunk.size / 2)
        chunksForHash.push(chunk.slice(0, 1024 * 2, file.type))
        chunksForHash.push(chunk.slice(center - 1024, center + 1024, file.type))
        chunksForHash.push(chunk.slice(chunk.size - 1024 * 2, chunk.length, file.type))
      }
    }

    const hash = await hasher(new Blob(chunksForHash))

    const checkRes = await checkFile({
      hash,
      fileName: file.name,
    })

    if(checkRes.exist) {
      onSend(genFileMsg({
        fileType: file.type,
        file: checkRes.file,
        tip: file.name,
      }))
      return
    }

    const limit = pLimit(5)
    const reqs = chunks.map((chunk, index) => {
      if(checkRes.chunks.includes(index)) return Promise.resolve('')

      return limit(async () => {
        const fd = new FormData()
        fd.append('file', chunk)
        fd.append('hash', hash)
        fd.append('index', index.toString())

        await uploadFile(fd)
      })
    })

    await Promise.all(reqs)

    const { file: fileName } = await mergeFile({
      hash,
      fileName: file.name,
    })

    onSend(genFileMsg({
      file: fileName,
      fileType: file.type,
      tip: file.name,
    }))
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if(text.length === 0) return

    onSend(genTextMsg(text))
    setText('')
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    if(e.clipboardData.files.length === 0) return

    e.preventDefault()
    filesChannel(e.clipboardData.files)
  }

  const disabled = useMemo(() => {
    return text.length === 0 || wsState !== WebSocketState.Open
  }, [text.length, wsState])

  useEffect(() => {
    const focusInput = (e: KeyboardEvent) => {
      if(e.key !== '/') return

      if(document.activeElement === inputRef.current) return
      
      e.preventDefault()
  
      inputRef.current?.focus()
    }
    document.addEventListener('keydown', focusInput)
    return () => document.removeEventListener('keydown', focusInput)
  }, [])

  return  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 max-w-640px rounded w-full flex justify-between items-center dark:text-white px-4 py-2 lt-sm:px-2">
    <form
      onSubmit={onSubmit}
      className="chat-form flex-auto rounded-lg overflow-hidden h-48px shadow-lg dark:shadow-dark-900 flex justify-between items-center backdrop-filter backdrop-blur-sm"
    >
      <input
        disabled={wsState !== WebSocketState.Open}
        type="text"
        value={text}
        onChange={onTextChange}
        ref={inputRef}
        className="chat-text-input flex-auto bg-transparent h-full pl-4 rounded-lg border border-transparent focus:(outline-none)"
        enterKeyHint="send"
        placeholder='👍🫲'
        title='text'
        autoComplete="off"
        aria-autocomplete="none"
        maxLength={464}
        onPaste={(e) => onPaste(e)}
      />
      <button disabled={disabled} title='发送' type="submit" className='flex-none w-38px h-38px rounded-full grid place-items-center transition  mx-1 text-gray-400 not-disabled:hover:(text-rose-400 bg-white dark:bg-black)'>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16"><path fill="currentColor" d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26l.001.002l4.995 3.178l3.178 4.995l.002.002l.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215l7.494-7.494l1.178-.471l-.47 1.178Z"/></svg>
      </button>
    </form>
    <input
      id="upload"
      name="upload"
      type="file"
      disabled={wsState !== WebSocketState.Open} onChange={onFileChange}
      className='hidden'
      placeholder='👍🫲'
      title='file'
      multiple={true}
    />
      <button
        disabled={wsState !== WebSocketState.Open}
        title='选择文件' type='button'
        className="flex-none w-48px ml-2 h-48px rounded-full grid place-items-center text-gray-700/500 dark:text-gray-400 backdrop-filter backdrop-blur-sm transition not-disabled:hover:text-rose-400"
      >
        <label htmlFor="upload" className='w-full h-full grid place-items-center'>
          <svg xmlns="http://www.w3.org/2000/svg" className='transform rotate-35' width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>
        </label>
      </button>
  </div>
}
