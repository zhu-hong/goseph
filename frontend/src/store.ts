import { create } from 'zustand'
import { Message, Task, WebSocketState } from './types'

interface WsStore {
  wsState: WebSocketState
  setWsState: (state: WebSocketState) => void
  messages: Message[]
  pushMessages: (messages: Message) => void
}

export const useWsStore = create<WsStore>((set) => {
  return {
    wsState: WebSocketState.Connecting,
    setWsState: (state) => set(() => ({ wsState:  state })),
    messages: [],
    pushMessages: (msg) => set((state) => ({ messages: [...state.messages, msg] }))
  }
})

interface TaskStore {
  tasks: Task[]
  save: (task: Task) => void
}

export const useTaskStore = create<TaskStore>((set) => {
  return {
    tasks: [],
    save: (task) => set((state) => {
      const newTask = [...state.tasks]

      const index = newTask.findIndex((t) => t.id === task.id)
      
      if(index !== -1) {
        newTask.splice(index, 1, {
          ...newTask[index],
          ...task,
        })
      } else {
        newTask.push(task)
      }

      return { tasks: newTask }
    }),
  }
})
