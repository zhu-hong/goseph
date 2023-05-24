import { create } from 'zustand'
import { Message, Task, TaskState, WebSocketState } from './types'

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
  cancel: (id: string) => void
}

export const useTaskStore = create<TaskStore>((set) => {
  return {
    tasks: [],
    save: (task) => set((state) => {
      const newTasks = [...state.tasks]

      const index = newTasks.findIndex((t) => t.id === task.id)
      
      if(index !== -1) {
        // 更新任务
        newTasks[index]= {
          ...newTasks[index],
          ...task,
        }
      } else {
        // 添加任务
        if([task.id, task.state, task.name, task.size, task.fileType, task.progress].some((p) => p === undefined) || task.state !== TaskState.WAITING) return { tasks: state.tasks }

        newTasks.unshift(task)
      }

      return { tasks: newTasks }
    }),
    cancel: (id) => set((state) => {
      const newTasks = [...state.tasks]
      
      const index = newTasks.findIndex((t) => t.id === id)
      if(index === -1) return { tasks: state.tasks }
      
      newTasks[index]?.cancel!()
      newTasks.splice(index, 1)
      return { tasks: newTasks }
    })
  }
})
