import { WebSocketState } from '@/App'
import { useState } from 'react'
import type { ChangeEvent, FC, FormEvent } from 'react'
import type { Message } from '@/App'

interface ChatInputBoxProps {
  onSend: (message: Message) => void;
  wsState: WebSocketState;
}

export const ChatInputBox: FC<ChatInputBoxProps> = ({ onSend, wsState }) => {
  const [text, setText] = useState('')

  function onTextChange(e: ChangeEvent<HTMLInputElement>) {
    setText(e.target.value)
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if(text.length === 0) return

    onSend({
      type: 'text',
      value: text,
    })
    setText('')
  }

  return  <div className="flex-none flex justify-between items-center dark:text-white">
    <form
      onSubmit={onSubmit}
      className="flex-auto rounded-lg overflow-hidden h-48px shadow dark:shadow-dark-900 flex justify-between items-center bg-gray-100 dark:bg-dark-700"
    >
      <input
        disabled={wsState !== WebSocketState.Open}
        value={text}
        onChange={onTextChange}
        placeholder="。。。"
        type="text"
        className="flex-auto bg-transparent h-full pl-4 focus:border-none focus:outline-none" 
      />
      <button disabled={text.length === 0 || wsState !== WebSocketState.Open} title='发送' type="submit" className={['flex-none w-38px h-38px rounded-full grid place-items-center transition  mx-1', (text.length === 0 || wsState !== WebSocketState.Open) ? 'text-gray-400 cursor-not-allowed' : 'text-rose-400 active:(bg-white dark:bg-black)'].join(' ')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 16 16"><path fill="currentColor" d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26l.001.002l4.995 3.178l3.178 4.995l.002.002l.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215l7.494-7.494l1.178-.471l-.47 1.178Z"/></svg>
      </button>
    </form>
    <button
      title='选择文件' type='button'
      className="flex-none w-48px h-48px ml-2 rounded-full grid place-items-center text-gray-700 dark:text-gray-400 transition active:(bg-white dark:bg-black)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M11.5 22q-2.3 0-3.9-1.6T6 16.5V6q0-1.65 1.175-2.825T10 2q1.65 0 2.825 1.175T14 6v8h-1.5V6q0-1.05-.725-1.775T10 3.5q-1.05 0-1.775.725T7.5 6v10.5q0 1.65 1.175 2.825T11.5 20.5q.725 0 1.363-.238T14 19.6v1.8q-.575.275-1.2.438T11.5 22Zm4.5-1v-3h-3v-2h3v-3h2v3h3v2h-3v3h-2Zm-4.5-4.5V18q-1.05 0-1.775-.725T9 15.5V6h1.5v9.5q0 .425.288.713t.712.287Zm4-5.5V6H17v5h-1.5Z"/></svg>
    </button>
  </div>
}
