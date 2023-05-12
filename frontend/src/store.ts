import { create } from 'zustand'
import { Message, WebSocketState } from './types'

interface WsStore {
  wsState: WebSocketState
  setWsState: (state: WebSocketState) => void
  messages: Message[]
  setMessages: (messages: Message) => void
}

export const useWsStore = create<WsStore>((set) => {
  return {
    wsState: WebSocketState.Connecting,
    setWsState: (state) => set(() => ({ wsState:  state })),
    messages: [],
    setMessages: (msg) => set((state) => ({ messages: [...state.messages, msg] }))
  }
})
